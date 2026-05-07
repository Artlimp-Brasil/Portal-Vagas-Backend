import { Client } from "@notionhq/client";
import { env } from "../config/env.js";

console.log("TOKEN SERVICE:", env.notionApiKey);

const notion = new Client({
    auth: env.notionApiKey,
});
export async function uploadFileToNotion(file) {
    try {
        const fileUpload = await notion.fileUploads.create({
            mode: "single_part",
            filename: file.name,
            content_type: file.mimetype,
        });

        const blob = new Blob([file.data], {
            type: file.mimetype,
        });

        const formData = new FormData();
        formData.append("file", blob, file.name);

        const response = await fetch(
            `https://api.notion.com/v1/file_uploads/${fileUpload.id}/send`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${env.notionApiKey}`,
                    "Notion-Version": env.notionVersion,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            throw {
                type: "NOTION_UPLOAD_ERROR",
                message: "Erro ao enviar arquivo para o Notion",
                details: errorText,
                status: response.status,
            };
        }

        const uploadedFile = await response.json();

        return uploadedFile.id;

    } catch (error) {
        console.error("Erro upload Notion:", error);

        throw {
            type: "UPLOAD_ERROR",
            message: error.message || "Erro ao fazer upload do arquivo",
            details: error.details || error,
        };
    }
}


export async function createApplicationPage(data, fileUploadId) {
    const salary = data.salary ? Number(data.salary) : null;

    try {
        return notion.pages.create({
            parent: {
                database_id: env.notionDatabaseId,
            },

            icon: {
                type: "icon",
                icon: {
                    name: "document",
                    color: "red"
                }
            },

            properties: {
                "Nome Completo": {
                    title: [
                        {
                            text: {
                                content: data.name || "",
                            },
                        },
                    ],
                },

                "E-mail": {
                    email: data.email || null,
                },

                "Telefone / WhatsApp": {
                    phone_number: data.phone || null,
                },

                "Cidade": {
                    select: data.city
                        ? { name: data.city }
                        : null,
                },

                "Qual a sua cidade? Você tem disponibilidade para se mudar? ": {
                    rich_text: [
                        {
                            text: {
                                content: data.otherCity || "",
                            },
                        },
                    ],
                },

                "Gênero": {
                    select: data.gender
                        ? { name: data.gender }
                        : null,
                },

                "Estado Civil": {
                    select: data.maritalStatus
                        ? { name: data.maritalStatus }
                        : null,
                },

                "Data de Nascimento": {
                    date: data.birthDate
                        ? { start: data.birthDate }
                        : null,
                },

                "Pretensão Salarial": {
                    number: Number.isNaN(salary) ? null : salary,
                },

                "Vagas desejadas": {
                    multi_select: data.job
                        ? [{ name: data.job }]
                        : [],
                },

                "Experiência": {
                    select: data.experience
                        ? { name: data.experience }
                        : null,
                },

                "Empresa": {
                    select: data.company
                        ? { name: data.company }
                        : null,
                },

                "Nos conte sobre sua trajetória profissional": {
                    rich_text: [
                        {
                            text: {
                                content: data.professionalJourney || "",
                            },
                        },
                    ],
                },

                "Nos conte sobre você": {
                    rich_text: [
                        {
                            text: {
                                content: data.aboutYou || "",
                            },
                        },
                    ],
                },

                "Currículo ( PDF ou Foto )": {
                    files: [
                        {
                            name: data.resumeName || "curriculo.pdf",
                            type: "file_upload",
                            file_upload: {
                                id: fileUploadId,
                            },
                        },
                    ],
                },

                "Status": {
                    select: {
                        name: "Novo Currículo",
                    },
                },
            },
        });

    } catch (error) {
        console.error("Erro criação página Notion:", error);

        throw {
            type: "NOTION_PAGE_ERROR",
            message: error.body?.message || "Erro ao criar página no Notion",
            details: error,
        };
    }
}