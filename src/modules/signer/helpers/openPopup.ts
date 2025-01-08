export default function openPopup(url: string, title: string): Window | null {
  const width = 360;
  const height = 480;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  const popup = window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top}`,
  );

  if (!popup) {
    throw new Error('Popup blocked');
  }

  return popup;
}
