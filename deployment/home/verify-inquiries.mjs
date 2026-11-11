// Run inside the landing container. Never prints environment values or responses containing records.
async function main() {
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url=process.env.SUPABASE_SERVER_URL;
  if(!key||!url||!process.env.INQUIRY_WORKER_SECRET)throw Error('Missing configuration');
  // Invalid values deliberately stop before insertion or notification creation.
  const response=await fetch(new URL('/rest/v1/rpc/submit_partnership_inquiry',url),{
    method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
    body:JSON.stringify({p_request_id:null,p_fields:{},p_rate_key:''}),signal:AbortSignal.timeout(10000)
  });
  const body=await response.json().catch(()=>({}));
  console.log(JSON.stringify({backend_http:response.status,backend_code:body.code||null}));
  if(response.status!==400||body.code!=='22023')throw Error('Backend guard verification failed');
  const worker=await fetch('http://127.0.0.1:3000/api/inquiries/notifications',{
    method:'POST',headers:{Authorization:`Bearer ${process.env.INQUIRY_WORKER_SECRET}`},signal:AbortSignal.timeout(100000)
  });
  const result=await worker.json().catch(()=>({}));
  console.log(JSON.stringify({worker_http:worker.status,processed:result.processed??null,delivered:result.delivered??null}));
  if(!worker.ok)throw Error('Worker verification failed');
}
main().catch(()=>{console.error('Inquiry connection checks failed; no credentials or response records displayed.');process.exitCode=1;});
