---
layout: post
title:  "Fix Start Menu Bugs"
date:  2019-09-15
desc: "Fix Start Menu Bugs"
keywords: "SharePoint, Microsoft, Windows, Server, Fix, Start, Menu"
categories: [sharepoint]
tags: [knowledge-base,infrastructure,support]
icon: fa-cloud
---

> Although not really affiliated with SharePoint, this happened while dealing with it:

### Problem
On a Development Machine, i was not able to add Start Menu Entries. New Programs did not add themselfs to Start Menu either. All other members of the company had similar issues, many have thought of a unresovable bug because of wrong setup.

### Cause
Simply put, users were not allowed to add Start Menu Entries.

### Solution	
 *[ ] Rightclick, Run: gpedit.msc
 *[ ] Navigate to: Computer Configuration > Windows Settings > Security Settings > Local Policies > Security Options
 *[ ] Enable Policy: User Account Control: Run all administrators in Admin Approval Mode
 *[ ] Reboot.

### Action
I wrote this little Article to prevent the wrong setup for the future.