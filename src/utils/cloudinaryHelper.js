const UPLOAD_MARKER = '/upload/';

function withTransform(url, transform) {
  if (!url || !url.includes(UPLOAD_MARKER)) return url;
  return url.replace(UPLOAD_MARKER, `${UPLOAD_MARKER}${transform}/`);
}

export function getGalleryThumbUrl(url, size = 300) {
  return withTransform(url, `w_${size},h_${size},c_fill,q_auto,f_auto,dpr_auto`);
}

export function getPreviewUrl(url, maxSize = 1600) {
  return withTransform(url, `w_${maxSize},h_${maxSize},c_limit,q_auto,f_auto`);
}
