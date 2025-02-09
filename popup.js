document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('customWidth').classList.add('hidden');
  document.getElementById('customHeight').classList.add('hidden');
  populateImagePresets('facebook');

  const uploadMessage = document.getElementById('uploadMessage');
  uploadMessage.classList.add('hidden');
});

document.getElementById('imageInput').addEventListener('change', (event) => {
  const fileInput = event.target;
  const uploadMessage = document.getElementById('uploadMessage');
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    uploadMessage.textContent = `Image "${file.name}" uploaded successfully!`;
    uploadMessage.classList.remove('hidden');
  } else {
    uploadMessage.textContent = 'Please upload a valid image file.';
    uploadMessage.classList.remove('hidden');
  }
});

document.getElementById('resizeButton').addEventListener('click', () => {
  const fileInput = document.getElementById('imageInput');
  const imgPresetOption = document.getElementById('imagePreset').value;
  const preset = document.getElementById('presetDimensions').value;
  const userWidth = document.getElementById('customWidth').value;
  const userHeight = document.getElementById('customHeight').value;
  const imgFormat = document.getElementById('outputFormat').value;
  const bgColor = document.getElementById('backgroundColor').value;

  if (fileInput.files.length === 0) {
    alert('Please select an image.');
    return;
  }

  const file = fileInput.files[0];
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result;
    img.onload = function () {
      let width, height;
      if (preset !== 'custom') {
        ({ width, height } = getPresetDimensions(preset, imgPresetOption));
      } else {
        width = userWidth;
        height = userHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const aspectRatio = img.width / img.height;
      if (width / height > aspectRatio) {
        width = height * aspectRatio;
      } else {
        height = width / aspectRatio;
      }

      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      ctx.drawImage(img, x, y, width, height);

      const downloadLink = document.getElementById('downloadLink');
      let mimeType = `image/${imgFormat}`;
      downloadLink.href = canvas.toDataURL(mimeType);
      downloadLink.download = `resized-image.${imgFormat}`;
      downloadLink.style.display = 'block';
      downloadLink.textContent = 'Download';
    };
  };
  reader.readAsDataURL(file);
});

document.getElementById('presetDimensions').addEventListener('change', () => {
  const preset = document.getElementById('presetDimensions').value;
  const customDimensions = preset === 'custom';

  document.getElementById('customWidth').classList.toggle('hidden', !customDimensions);
  document.getElementById('customHeight').classList.toggle('hidden', !customDimensions);
  document.getElementById('imagePreset').classList.toggle('hidden', customDimensions);

  resetUploadState();

  if (!customDimensions) {
    populateImagePresets(preset);
    const imgPresetValue = document.getElementById('imagePreset').value;
    updateResizeButtonState(preset, imgPresetValue);
  }
});

document.getElementById('imagePreset').addEventListener('change', () => {
  const preset = document.getElementById('presetDimensions').value;
  const imgPresetOption = document.getElementById('imagePreset').value;
  updateResizeButtonState(preset, imgPresetOption);
});

function resetUploadState() {
  const uploadMessage = document.getElementById('uploadMessage');
  const downloadLink = document.getElementById('downloadLink');
  const fileInput = document.getElementById('imageInput');

  uploadMessage.textContent = '';
  uploadMessage.classList.add('hidden');
  downloadLink.style.display = 'none';
  fileInput.value = null;
}

function updateResizeButtonState(preset, imgPresetOption) {
  const presetDimensions = getPresetDimensions(preset, imgPresetOption);
  document.getElementById('customWidth').value = presetDimensions.width;
  document.getElementById('customHeight').value = presetDimensions.height;
}

function getPresetDimensions(preset, imgPresetOption) {
  const dimensions = {
    facebook: {
      'profilephoto': { width: 170, height: 170 },
      'coverphoto': { width: 851, height: 315 },
      'landscape': { width: 1200, height: 630 },
      'portrait': { width: 630, height: 1200 },
      'story': { width: 1080, height: 1920 },
      'square': { width: 1200, height: 1200 },
    },
    instagram: {
      'profilephoto': { width: 320, height: 320 },
      'landscape': { width: 1080, height: 566 },
      'portrait': { width: 1080, height: 1350 },
      'story': { width: 1080, height: 1920 },
      'square': { width: 1080, height: 1080 },
    },
    twitter: {
      'profilephoto': { width: 400, height: 400 },
      'headerphoto': { width: 1500, height: 500 },
      'landscape': { width: 1600, height: 900 },
      'portrait': { width: 1080, height: 1350 },
      'square': { width: 1080, height: 1080 },
    },
    linkedin: {
      'profilephoto': { width: 400, height: 400 },
      'coverphoto': { width: 1128, height: 191 },
      'landscape': { width: 1200, height: 627 },
      'portrait': { width: 627, height: 1200 },
      'square': { width: 1080, height: 1080 },
    },
  };
  return dimensions[preset][imgPresetOption];
}

function populateImagePresets(preset) {
  const imagePreset = document.getElementById('imagePreset');
  imagePreset.innerHTML = ''; // Clear previous options

  const dimensions = {
    facebook: ['profilephoto', 'coverphoto', 'landscape', 'portrait', 'story', 'square'],
    instagram: ['profilephoto', 'landscape', 'portrait', 'story', 'square'],
    twitter: ['profilephoto', 'headerphoto', 'landscape', 'portrait', 'square'],
    linkedin: ['profilephoto', 'coverphoto', 'landscape', 'portrait', 'square'],
  };

  if (dimensions[preset]) {
    dimensions[preset].forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option.replace(/([A-Z])/g, ' $1').trim();
      imagePreset.appendChild(opt);
    });
  }
}
