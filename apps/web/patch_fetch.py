import os
import glob
import re

base_path = "/Users/satyamkumar/Desktop/Revora/apps/web/app/dashboard"
files = glob.glob(f"{base_path}/**/*.tsx", recursive=True)

import_statement = 'import { authFetch } from "@/utils/api";\n'

for f in files:
    with open(f, "r") as file:
        content = file.read()
    
    # Check if we need to replace
    if "fetch(" in content and "authFetch" not in content:
        # Replace strictly fetching the API
        new_content = content.replace("fetch(", "authFetch(")
        
        # Inject the import at the top after "use client"; if it exists
        if '"use client";' in new_content:
            new_content = new_content.replace('"use client";', '"use client";\n' + import_statement, 1)
        else:
            new_content = import_statement + new_content
            
        with open(f, "w") as file:
            file.write(new_content)
        print(f"Patched {f}")
print("Finished patching!")
