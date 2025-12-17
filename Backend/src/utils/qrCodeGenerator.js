import QRCode from 'qrcode';

/**
 * Generate QR code as Data URL (base64 PNG)
 * @param {string} url - URL to encode in QR code
 * @param {object} options - QR code generation options
 * @returns {Promise<string>} Base64 encoded QR code data URL
 */
export const generateQRCode = async (url, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        };

        const qrOptions = { ...defaultOptions, ...options };
        
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(url, qrOptions);
        
        return qrCodeDataUrl;
    } catch (error) {
        throw new Error(`Failed to generate QR code: ${error.message}`);
    }
};

/**
 * Generate QR code as SVG string
 * @param {string} url - URL to encode in QR code
 * @param {object} options - QR code generation options
 * @returns {Promise<string>} SVG string
 */
export const generateQRCodeSVG = async (url, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'svg',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        };

        const qrOptions = { ...defaultOptions, ...options };
        
        // Generate QR code as SVG
        const qrCodeSVG = await QRCode.toString(url, qrOptions);
        
        return qrCodeSVG;
    } catch (error) {
        throw new Error(`Failed to generate QR code SVG: ${error.message}`);
    }
};

/**
 * Generate QR code as buffer
 * @param {string} url - URL to encode in QR code
 * @param {object} options - QR code generation options
 * @returns {Promise<Buffer>} PNG buffer
 */
export const generateQRCodeBuffer = async (url, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'M',
            type: 'png',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            width: 300
        };

        const qrOptions = { ...defaultOptions, ...options };
        
        // Generate QR code as buffer
        const qrCodeBuffer = await QRCode.toBuffer(url, qrOptions);
        
        return qrCodeBuffer;
    } catch (error) {
        throw new Error(`Failed to generate QR code buffer: ${error.message}`);
    }
};

/**
 * Validate QR code generation options
 * @param {object} options - Options to validate
 * @returns {boolean} True if valid
 */
export const validateQROptions = (options) => {
    const validErrorCorrectionLevels = ['L', 'M', 'Q', 'H'];
    const validFormats = ['png', 'svg'];
    
    if (options.errorCorrectionLevel && !validErrorCorrectionLevels.includes(options.errorCorrectionLevel)) {
        return false;
    }
    
    if (options.format && !validFormats.includes(options.format)) {
        return false;
    }
    
    if (options.width && (options.width < 100 || options.width > 1000)) {
        return false;
    }
    
    return true;
};
