# [Knowledge Base](../)
## Update User Profile Without Sync

SharePoint Benutzer werden im sogenannten User Profile Service sowie site-spezifisch in der User-Information List geführt. Änderungen am Profil des Benutzers im Active Directory werden über einen Sync Job im SP übernommen. Ist dieser Sync deaktiviert, müssen die Änderungen anderweitig übernommen werden.

### **Vollständige Aktualisierung**

Eine Vollständige Aktualisierung kann nur dann geschehen, wenn der Benutzer im UPS aktualisiert wird. Im Anschluss müssen die Informationen aus dem UPS auf die User-Information Listen gesynct werden. 

#### **1) Aktualisierung Benutzer im UPS**

* Öffne **Central Administration**, gehe zur **User Profile Administration**

* In der Kategorie **People** öffne **Manage User Profiles**

* Suche nach dem **Account name**, drücke **Find**

* Drücke anschliessend auf den **Account name** in der erschienenen Liste

  * Fall: Benutzerdaten manuell abgleichen

    * Aus dem Kontextmenü wähle **Edit My Profile**

    * Tippe die gewünschten Änderungen ab, drücke **Save and Close**

      Die neuen Eigenschaften werden beim anschliessenden Update Vorgang übernommen.

  * Fall: Benutzer neu importieren

    * Aus dem Kontextmenü wähle **Delete**.  Das Profil wird beim anschliessenden Update Vorgang automatisch neu erstellt.

#### **2) User-Information Listen updaten**

Für das Updaten der Benutzerinformationslisten steht das nachfolgende Skript zur Verfügung.

```
Add-PSSnapin Microsoft.SharePoint.PowerShell -ea 0;  
$ErrorActionPreference = "SilentlyContinue";  

# $syncLoginNames = @("johnev", "garaio-admin");
$syncLoginNames = @();
   
$PropertyMap=@("Title,PreferredName,Display Name",  
"EMail,WorkEmail,EMail",  
"MobilePhone,CellPhone,Mobile Phone",  
"Notes,AboutMe,About Me",  
"SipAddress,WorkEmail,Sip Address",  
"Picture,PictureURL,Picture URL",  
"Department,Department,Department",  
"JobTitle,SPS-JobTitle,Job Title",  
"FirstName,FirstName,First Name",  
"LastName,LastName,Last Name",  
"WorkPhone,WorkPhone,Work Phone",  
"UserName,UserName,UserName",  
"WebSite,WebSite,WebSite",  
"SPSResponsibility,SPS-Responsibility,Ask About Me",  
"Office,Office,Office");  
  
$Context = Get-SPServiceContext $(Get-SPWebApplication -IncludeCentralAdministration | ? {$_.IsAdministrationWebApplication}).Url;  
$ProfileManager = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($Context);  

Write-Host "# Updating User Information Lists"
if($ProfileManager){  
    foreach ($Site in $(Get-SPSite -Limit All | ? {!$_.Url.Contains("Office_Viewing_Service_Cache")})){  
        $RootWeb = $Site.RootWeb;  
        Write-Host "* $($Site.Url)"  
  
        foreach ($User in $($RootWeb.SiteUsers)){  
            if (($syncLoginNames.Length -eq 0 -or  ( $User.LoginName -match ($syncLoginNames -join ("|")))) -and $ProfileManager.UserExists($($User.UserLogin))){  
                $UPUser = $ProfileManager.GetUserProfile($($User.UserLogin));  
                $UserList = $RootWeb.SiteUserInfoList;  
  
                $Query = New-Object Microsoft.SharePoint.SPQuery;  
                $Query.Query = "<Where><Eq><FieldRef Name='Name' /><Value Type='Text'>$($User.UserLogin)</Value></Eq></Where>";  
                $UserItem = $UserList.GetItems($Query)[0];  
  
                ForEach ($Map in $PropertyMap){  
                    $PropName = $Map.Split(',')[0];  
                    $SiteProp = $UserItem[$PropName];  
                    $UPSProp = $UPUser[$($Map.Split(',')[1])].Value;  
                    $DisplayName = $Map.Split(',')[2];  
   
                    if($PropName -eq "Notes"){  
                        #Write-Host "$DisplayName Updated: $SiteProp - $($UPSProp[0].Replace("&nbsp;"," "))";  
                        $UserItem[$PropName] = $($UPSProp[0].Replace("&nbsp;"," "));  
                    }elseif($PropName -eq "Picture"){  
                        #Write-Host "$DisplayName Updated: $($SiteProp.Split(",")[0]) - $($UPSProp[0])";  
                        $UserItem[$PropName] = $UPSProp[0];  
                    }elseif($PropName -eq "SPSResponsibility"){  
                        #Write-Host "$DisplayName Updated: $SiteProp - $($UPSProp -join ', ')";  
                        $UserItem[$PropName] = $($UPSProp -join ', ');  
                    }else{  
                        #Write-Host "$DisplayName Updated: $SiteProp - $UPSProp";  
                        $UserItem[$PropName] = $UPSProp;  
                    }  
                }  
                Write-Host "  * $($User.LoginName)";  
                $UserItem.SystemUpdate();  
                #Write-Host "";  
            }  
        }  
        $RootWeb.Dispose();  
        #Write-Host "";  
    }   
}else{  
    Write-Host -foreground red "Cant connect to the User Profile Service. Please make sure that the UPS is connected to the Central Administration Web Application. Also make sure that you have Administrator Rights to the User Profile Service";  
} 
```



Falls nur bestimmte Benutzer gesynct werden sollen, können diese in das Skript unter `$syncLoginNames` abgespeichert werden. Benutzung wie im Beispiel. Die erlaubten Login Namen sind reguläre Ausdrücke die die Gross und Kleinschreibung ignorieren.

```
$syncLoginNames = @("garaio\\johnev", "ADMIN$" ); 
```

### **Quick Sync (nur Email und AnzeigeName)**

Für die schnelle Konfiguration steht das Powershell CMDlet `Set-SPUser` zur Verfügung. Dabei werden jedoch nur die Attribute `mail` und `displayName` synchronisiert. Das Profil im UPS wird dabei nicht verändert.



Zum Aktualisieren eines Benutzers auf einem bestimmten Web kann folgender Code verwendet werden:

```
Set-SPUser -Identity 'Contoso\jdoe' -Web https://intranet.contoso.com -SyncFromAD
```



Um alle Benutzer auf allen Seiten zu aktualisieren kann folgender Befehl benutzt werden:

```
Get-SPSite -Limit All | Select -ExpandProperty RootWeb | Get-SPUser | Set-SPUser -SyncFromAD -EA 0
```