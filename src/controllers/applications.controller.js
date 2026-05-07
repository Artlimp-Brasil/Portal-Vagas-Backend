import {
  uploadFileToNotion,
  createApplicationPage,
} from "../services/notion.service.js";
export async function createApplication(req, res) {
    try {
        const data = req.body;
        const file = req.files?.resumeFile;

        if (!file) {
            return res.status(400).json({
                error: true,
                message: "Currículo não enviado",
            });
        }

        const fileUploadId = await uploadFileToNotion(file);

        const notionPage = await createApplicationPage(data, fileUploadId);

        return res.status(201).json({
            success: true,
            message: "Candidatura enviada com sucesso",
            notionPageId: notionPage.id,
        });

    } catch (error) {
        console.error("Erro geral:", error);

        return res.status(error.status || 500).json({
            error: true,
            type: error.type || "INTERNAL_ERROR",
            message: error.message || "Erro interno no servidor",
            details: process.env.NODE_ENV === "development" ? error.details : undefined,
        });
    }
}