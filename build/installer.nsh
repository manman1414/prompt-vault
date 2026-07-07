; NSIS custom install hooks
; @author prompt-vault team
; @date 2026-07-07
;
; 桌面/开始菜单快捷方式显式使用 resources/icon.ico，避免 exe 内嵌图标未生效

!macro customInstall
  CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$appExe" "" "$INSTDIR\resources\icon.ico" 0
  CreateShortCut "$SMPROGRAMS\${SHORTCUT_NAME}.lnk" "$appExe" "" "$INSTDIR\resources\icon.ico" 0
!macroend
