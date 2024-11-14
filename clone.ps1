$directory_bp = 'C:\Users\Alecs\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs\Sapling BP'
$directory_rp = 'C:\Users\Alecs\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs\Sapling RP'

$repository_destination = 'C:\Users\Alecs\Desktop\Programming\Addons\Sapling\sources'

if (Test-Path $directory_bp) {
    $new_name_bp = 'Sapling [BP]'
    Copy-Item -Path $directory_bp -Destination "$repository_destination\$new_name_bp" -Recurse
    Write-Host "Copied BP directory as $new_name_bp."
} else {
    Write-Host "The BP directory does not exist."
}

if (Test-Path $directory_rp) {
    $new_name_rp = 'Sapling [RP]'
    Copy-Item -Path $directory_rp -Destination "$repository_destination\$new_name_rp" -Recurse
    Write-Host "Copied RP directory as $new_name_rp."
} else {
    Write-Host "The RP directory does not exist."
}
