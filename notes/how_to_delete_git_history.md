## Deleting text from entire git history.

if secrets are leaked into the git  repo. here is how to delete it. 

1. **Install git-filter repo**  
    run `pip install git-filter-repo` on windows (if you have pip).
2. **Clone repo to new location**  
    run `git clone --mirror git@github.com:your-user/your-repo.git cleaned-repo.git`. This is required
    to ensure the local repo is not impacted. mirror is also different from clone, there are no files or anything. (it does not have a working directory.)
3. **Create the remove.txt file**  
    <pre>
    echo 'SECRET_KEY' > remove.txt
    git filter-repo --replace-text remove.txt --force
     </pre>
     note that the '' are not required in the remove.txt if you do not have them in your text.
     This should remove any text matching the secret key from all of git history and replace it with `**REMOVE**`
4. **Remove a whole file**  
    If you have leaked a secrets file, run this command. `git filter-repo --path secrets.txt --invert-paths --all --force`. This file will be deleted from all instances of the git repository. 
5. **Check results**  
    Run: `git log -p --all >git_logs.txt`. this will load all commit logs into a txt file where you can look through the contents and see if the secret is still present.
6. **Push changes to main.**  
    <pre>
    git remote add origin git@github.com:myuser/myrepo.git
    git push --force --mirror
    </pre>
    The remote repo should now be fully up to date with all content remove. 
7. **Update the local repo**  
    <pre>
        git checkout -b before-update-branch # creates a fresh branch.
        git checkout main # make sure your on the main branch. 
        git fetch origin
        git reset --hard origin/main # resets your local repo to what is in the remote repo
        git branch -D before-update-branch # will delete the new branch
    </pre>
    Note that as you run these commands, after the git reset, make sure the repository feels ok before you delete the before-update branch, also note you do not need to create a before-update-branch. that is just for safety.  

Your code is now fully deleted in both the remote repo and your own local repo and you should be able to proceed as normal. 