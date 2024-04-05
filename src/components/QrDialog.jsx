import { Download } from 'lucide-react';
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './Index';

const QrDialog = ({ shortenedUrl, qrcode }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrcode;
    link.download = `${shortenedUrl.shortenUrl}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-xl text-center">QR Code</DialogTitle>
        <DialogDescription className="text-center">
          Scan the QR Code to open the link on your phone
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-center items-center">
        <img src={qrcode} alt={shortenedUrl.shortUrl} download />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={handleDownload}>
          <Download />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default QrDialog;
