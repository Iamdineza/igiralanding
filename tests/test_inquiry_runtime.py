from pathlib import Path
import importlib.util
import tempfile
import unittest

path=Path(__file__).resolve().parents[1]/'deployment/home/prepare-inquiries.py'
spec=importlib.util.spec_from_file_location('inquiry_runtime',path)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
original='''staging.igiraprovisoire.rw {
    @approved remote_ip 192.0.2.1/32
    handle @approved { reverse_proxy web:8080 }
    handle { respond "Private" 403 }
}
api-staging.igiraprovisoire.rw {
    @approved remote_ip 192.0.2.1/32
    handle @approved { reverse_proxy private-api:8080 }
    handle { respond "Private" 403 }
}
home.igiraprovisoire.rw { reverse_proxy igira-home-web:3000 }
'''

class InquiryRuntimeTests(unittest.TestCase):
    def test_only_three_post_rpcs_added_inside_existing_api_host(self):
        result=module.render(original,'172.29.0.0/16')
        self.assertEqual(result.split('api-staging.igiraprovisoire.rw {')[0],original.split('api-staging.igiraprovisoire.rw {')[0])
        self.assertTrue(result.endswith(original[original.index('    @approved remote_ip',original.index('api-staging.igiraprovisoire.rw {')):]))
        self.assertIn('remote_ip 172.29.0.0/16',result)
        self.assertIn('method POST',result)
        self.assertEqual(result.count('/rest/v1/rpc/'),3)
        self.assertNotIn('path /rest/v1/*',result)
    def test_unexpected_subnets_and_existing_changes_fail_closed(self):
        for subnet in ['0.0.0.0/0','169.58.229.64/32','172.0.0.0/8']:
            with self.assertRaises(ValueError):module.render(original,subnet)
        with self.assertRaises(ValueError):module.render(module.render(original,'172.29.0.0/16'),'172.29.0.0/16')
        with self.assertRaises(ValueError):module.render(original.replace('@approved remote_ip','@other remote_ip'),'172.29.0.0/16')
    def test_configuration_writer_never_overwrites_existing_files(self):
        with tempfile.TemporaryDirectory() as directory:
            p=Path(directory)/'private'
            module.write_new(p,'fixture',0o600)
            with self.assertRaises(FileExistsError):module.write_new(p,'replacement',0o600)
            self.assertEqual(p.read_text(),'fixture')

if __name__=='__main__':unittest.main()
