from pathlib import Path
import contextlib
import importlib.util
import io
import json
import tempfile
import unittest
from unittest.mock import patch

path = Path(__file__).resolve().parents[1] / 'deployment/home/prepare-proxy.py'
spec = importlib.util.spec_from_file_location('home_proxy', path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
original = '''{ admin off }
staging.igiraprovisoire.rw {
    @approved remote_ip 192.0.2.1/32
    handle @approved { reverse_proxy web:8080 }
    handle { respond "Private migration preview" 403 }
}
api-staging.igiraprovisoire.rw {
    @approved remote_ip 192.0.2.1/32
    handle @approved { reverse_proxy private-api:8080 }
    handle { respond "Private migration preview" 403 }
}
'''

class HomeProxyTests(unittest.TestCase):
    def test_public_host_is_appended_without_changing_private_hosts(self):
        result = module.render(original)
        self.assertTrue(result.startswith(original.rstrip()))
        home = result.split('home.igiraprovisoire.rw {', 1)[1]
        self.assertNotIn('remote_ip', home)
        self.assertIn('reverse_proxy igira-home-web:3000', home)
        self.assertNotIn('private-api', home)
        self.assertIn('noindex', home)

    def test_unexpected_or_duplicate_host_configuration_is_rejected(self):
        for value in ('', original.replace('@approved remote_ip', '@different remote_ip'), original + '\nhome.igiraprovisoire.rw {}'):
            with self.assertRaises(ValueError):
                module.render(value)

    def test_preparer_preserves_active_file_and_refuses_overwrites(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / 'security.Caddyfile'
            source.write_text(original, encoding='utf-8')
            inspection = json.dumps([{'Mounts':[{'Type':'bind','Destination':'/etc/caddy/Caddyfile','Source':str(source)}]}])
            with patch('sys.argv',['prepare-proxy.py','--staging',directory]), patch.object(module.subprocess,'check_output',return_value=inspection), contextlib.redirect_stdout(io.StringIO()):
                module.main()
                self.assertEqual(source.read_text(encoding='utf-8'),original)
                self.assertIn('external: true',(root/'compose.home-proxy.yaml').read_text())
                with self.assertRaises(SystemExit):
                    module.main()

if __name__ == '__main__':
    unittest.main()
