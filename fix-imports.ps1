# Script to fix Locale imports from @/lib/dictionaries to @/types

$files = Get-ChildItem -Path "src" -Include "*.ts", "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Fix imports that only have Locale
    if ($content -match "import type \{ Locale \} from '@/lib/dictionaries';") {
        $content = $content -replace "import type \{ Locale \} from '@/lib/dictionaries';", "import type { Locale } from '@/types';"
        $modified = $true
    }
    
    # Fix imports that have Dictionary, Locale
    if ($content -match "import type \{ Dictionary, Locale \} from '@/lib/dictionaries';") {
        $content = $content -replace "import type \{ Dictionary, Locale \} from '@/lib/dictionaries';", "import type { Dictionary, Locale } from '@/types';"
        $modified = $true
    }
    
    # Fix imports that have Locale, Dictionary
    if ($content -match "import type \{ Locale, Dictionary \} from '@/lib/dictionaries';") {
        $content = $content -replace "import type \{ Locale, Dictionary \} from '@/lib/dictionaries';", "import type { Locale, Dictionary } from '@/types';"
        $modified = $true
    }
    
    # Fix imports that only have Dictionary
    if ($content -match "import type \{ Dictionary \} from '@/lib/dictionaries';") {
        $content = $content -replace "import type \{ Dictionary \} from '@/lib/dictionaries';", "import type { Dictionary } from '@/types';"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed imports in: $($file.FullName)"
    }
}

Write-Host "Done fixing imports!"
