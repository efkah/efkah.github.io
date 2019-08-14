# [Knowledge Base](../)

## Read Farm Account Password from Apppool

### Problem
You have access to a SharePoint Farm Backend but not sufficient rights to do what you have to do.
### Cause
Security issues, lost passwords, and many more
### Solution
Get the Farm Accounts Password via console (read the username in IIS)
```
cmd.exe /k C:\windows\system32\inetsrv\appcmd.exe list apppool "SharePoint Central Administration v4" /text:ProcessModel.Password
```
### Action
Real Solution is ofc requesting Farm Admin Access or such.