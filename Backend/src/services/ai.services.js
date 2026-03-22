const { GoogleGenAI, Type } = require("@google/genai");
const chromium = require("@sparticuz/chromium")
const puppeteerCore = require("puppeteer-core")
const puppeteer = require("puppeteer")

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});

// Native Google GenAI schema (OpenAPI subset) — zodToJsonSchema is NOT compatible
const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The job title for which the interview report is generated"
        },
        matchScore: {
            type: Type.NUMBER,
            description: "Score 0-100 indicating how well the candidate matches the job"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical interview questions with intent and suggested answer",
            items: {
                type: Type.OBJECT,
                properties: {
                    question:  { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer:    { type: Type.STRING }
                },
                required: ["question","intention","answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral interview questions with intent and suggested answer",
            items: {
                type: Type.OBJECT,
                properties: {
                    question:  { type: Type.STRING },
                    intention: { type: Type.STRING },
                    answer:    { type: Type.STRING }
                },
                required: ["question","intention","answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "Skills the candidate is lacking for this role",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill:    { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ["low","medium","high"] }
                },
                required: ["skill","severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "Day-wise preparation plan",
            items: {
                type: Type.OBJECT,
                properties: {
                    day:   { type: Type.NUMBER },
                    focus: { type: Type.STRING },
                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["day","focus","tasks"]
            }
        }
    },
    required: ["title","matchScore","technicalQuestions","behavioralQuestions","skillGaps","preparationPlan"]
}

async function generateInterviewReport({resume, selfDescription, jobDescription}){

    const prompt = `You are an expert technical recruiter. Generate a structured interview preparation report for a candidate applying for the following job.

Job Description:
${jobDescription}

Candidate Resume:
${resume || "Not provided"}

Candidate Self Description:
${selfDescription || "Not provided"}

Return the report as a JSON object following the specified schema exactly.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const isVercel = !!process.env.VERCEL

    const browser = isVercel
        ? await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless
        })
        : await puppeteer.launch({ headless: true })

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}
    
async function generateResumePdf({ resume ,selfDescription , jobDescription }){
    const resumePdfSchema = {
        type: Type.OBJECT,
        properties: {
            html: { type: Type.STRING, description: "Full HTML content of the resume, ready to be converted to PDF" }
        },
        required: ["html"]
    }

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema,
        }
    })

    const jsonContent = JSON.parse(response.text)

    //for generating pdf
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    //pdf aajayega
    return pdfBuffer
}

module.exports = {generateInterviewReport,generateResumePdf}