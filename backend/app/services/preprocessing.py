import cv2
import numpy as np


class ImagePreprocessor:
    """Preprocessing pipeline for OCR: grayscale, deskew, denoise, threshold."""

    def preprocess(self, image_bytes: bytes) -> bytes:
        """Process raw image bytes through the full preprocessing pipeline.
        Returns optimized PNG bytes ready for OCR.
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image")

        # Step 1: Grayscale conversion
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Step 2: Deskew
        gray = self._deskew(gray)

        # Step 3: Noise reduction
        gray = cv2.fastNlMeansDenoising(gray, h=10)

        # Step 4: Adaptive thresholding for cleaner text
        gray = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 11, 2
        )

        # Encode back to PNG bytes
        success, buffer = cv2.imencode(".png", gray)
        if not success:
            raise ValueError("Could not encode preprocessed image")
        return buffer.tobytes()

    def _deskew(self, image: np.ndarray) -> np.ndarray:
        """Detect and correct skew angle in the image."""
        coords = np.column_stack(np.where(image > 0))
        if len(coords) < 5:
            return image
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
        # Skip trivial rotations
        if abs(angle) < 0.5:
            return image
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        return cv2.warpAffine(
            image, M, (w, h),
            flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
        )
