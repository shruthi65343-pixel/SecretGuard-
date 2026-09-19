import sys
import os
from .scanner import scan_project_folder

def main():
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "demo_project"
    
    # Handle relative paths
    if not os.path.isabs(target_dir):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        candidate = os.path.join(base_dir, target_dir)
        if os.path.exists(candidate):
            target_dir = candidate
        else:
            target_dir = os.path.abspath(target_dir)
            
    print("=" * 60)
    print("              SECRETGUARD SECURITY SCANNER              ")
    print("=" * 60)
    print(f"\nScanning directory: {target_dir}\n")
    
    if not os.path.exists(target_dir):
        print(f"Error: Path '{target_dir}' does not exist.")
        sys.exit(1)
        
    scanned_count, findings = scan_project_folder(target_dir)
    
    print(f"Files scanned: {scanned_count}")
    print(f"Secrets detected: {len(findings)}\n")
    
    if len(findings) > 0:
        for idx, f in enumerate(findings, start=1):
            print(f"Finding #{idx}")
            print(f"  Type:        {f.secret_type}")
            print(f"  File:        {f.relative_path}")
            print(f"  Line:        {f.line_number}")
            print(f"  Risk:        {f.risk_level}")
            print(f"  Confidence:  {f.confidence_score}%")
            print(f"  Fingerprint: {f.fingerprint}")
            print(f"  Blast Radius:{f.blast_radius}")
            print(f"  Snippet:     {f.line_content_masked}")
            print(f"  Value:       [HIDDEN]")
            print("-" * 40)
            
        print("\n" + "=" * 60)
        print("SECRETGUARD SCAN FAILED")
        print("Possible exposed secrets detected.")
        print("Recommended action: remediate exposed secrets before committing.")
        print("=" * 60)
        sys.exit(1)
    else:
        print("=" * 60)
        print("SECRETGUARD SCAN PASSED")
        print("No possible secrets detected.")
        print("Commit can proceed safely.")
        print("=" * 60)
        sys.exit(0)

if __name__ == "__main__":
    main()
