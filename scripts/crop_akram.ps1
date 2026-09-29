Add-Type -AssemblyName System.Drawing

$sourcePath = "e:\Sky-Laban\public\images\founders\founders_reference_banner.jpg"
$destPath = "e:\Sky-Laban\public\images\founders\akram-ali-khan-hd.jpg"

$srcImg = [System.Drawing.Image]::FromFile($sourcePath)

$cropX = 10
$cropY = 35
$cropW = 350
$cropH = 385

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$bmp = New-Object System.Drawing.Bitmap($cropW, $cropH)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
$graphics.DrawImage($srcImg, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)

$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$graphics.Dispose()
$bmp.Dispose()
$srcImg.Dispose()

Write-Output "Cropped clean Akram portrait successfully to $destPath"
