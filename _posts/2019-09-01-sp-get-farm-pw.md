---
layout: post
title:  "Read Farm Account Password from Apppool"
date:  2019-09-01
desc: "Read Farm Account Password from Apppool"
keywords: "SharePoint, Microsoft, Read, Farm, Account, Password, from, Apppool"
categories: [SharePoint]
tags: [knowledge-base,infrastructure]
icon: fa-cloud
---

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