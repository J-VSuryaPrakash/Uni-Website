import ImageKit from "imagekit";

export const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

interface UploadOptions {
    file: Buffer;
    fileName: string;
    folder?: string;
}

export const uploadOnImageKit = async ({
    file,
    fileName,
    folder = "/uploads",
}: UploadOptions) => {
    try {
        const result = await imagekit.upload({
            file,
            fileName,
            folder,
        });

        return {
            fileId: result.fileId,
            name: result.name,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
            fileType: result.fileType,
            size: result.size,
        };
    } catch (error: any) {
        throw new Error(`ImageKit upload failed: ${error.message}`);
    }
};