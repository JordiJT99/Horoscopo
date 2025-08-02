# Fix specific import patterns in page files

$pageFiles = Get-ChildItem -Path "src\app" -Include "*.tsx" -Recurse

foreach ($file in $pageFiles) {
    $lines = Get-Content $file.FullName
    $modified = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Fix only type imports of Locale from @/lib/dictionaries
        if ($line -match "import type \{ Locale \} from '@/lib/dictionaries';") {
            $lines[$i] = "import type { Locale } from '@/types';"
            $modified = $true
        }
        elseif ($line -match "import type \{ Dictionary, Locale \} from '@/lib/dictionaries';") {
            $lines[$i] = "import type { Dictionary, Locale } from '@/types';"
            $modified = $true
        }
        elseif ($line -match "import type \{ Locale, Dictionary \} from '@/lib/dictionaries';") {
            $lines[$i] = "import type { Locale, Dictionary } from '@/types';"
            $modified = $true
        }
    }
    
    if ($modified) {
        $lines | Set-Content -Path $file.FullName
        Write-Host "Fixed imports in: $($file.FullName)"
    }
}

Write-Host "Done fixing page imports!"
