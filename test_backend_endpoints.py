import json
import urllib.request
import urllib.parse

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, url, method="GET", payload=None):
    print(f"\n--- Testing {name} [{method} {url}] ---")
    try:
        req = urllib.request.Request(url, method=method)
        if payload:
            data = json.dumps(payload).encode('utf-8')
            req.add_header('Content-Type', 'application/json')
            response = urllib.request.urlopen(req, data=data)
        else:
            response = urllib.request.urlopen(req)
            
        status_code = response.getcode()
        body = json.loads(response.read().decode('utf-8'))
        print(f"Status Code: {status_code}")
        print(f"Response Summary: {json.dumps(body, indent=2)[:400]}...")
        return True, body
    except Exception as e:
        print(f"FAILED: {e}")
        return False, str(e)

def run_all_tests():
    print("=" * 60)
    print("SECRETGUARD BACKEND ENDPOINT VERIFICATION SUITE")
    print("=" * 60)
    
    # 1. GET /
    ok1, _ = test_endpoint("GET / (Root Health Check)", f"{BASE_URL}/")
    
    # 2. POST /scan with demo_project
    ok2, scan_res = test_endpoint("POST /scan (demo_project)", f"{BASE_URL}/scan", method="POST", payload={"target_path": "demo_project"})
    
    # 3. GET /findings
    ok3, _ = test_endpoint("GET /findings", f"{BASE_URL}/findings")
    
    # 4. GET /risk-summary
    ok4, _ = test_endpoint("GET /risk-summary", f"{BASE_URL}/risk-summary")
    
    print("\n" + "=" * 60)
    if ok1 and ok2 and ok3 and ok4:
        print("ALL 5 ENDPOINT TESTS PASSED SUCCESSFULLY!")
    else:
        print("SOME TESTS FAILED!")
    print("=" * 60)

if __name__ == "__main__":
    run_all_tests()
