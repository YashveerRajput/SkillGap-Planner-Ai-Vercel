//aab hum pdf k andar ka content nikaal rhe hain
const pdfParse = require("pdf-parse")
const {generateInterviewReport,generateResumePdf} = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req,res){
    try{
        const {selfDescription,jobDescription} = req.body

        // parse PDF only if a file was uploaded
        let resumeContent = ""
        if(req.file){
            const resumeData = await pdfParse(req.file.buffer)
            resumeContent = resumeData.text || ""
        }

        // check based on whether a file was uploaded OR self description was provided
        const hasResume = !!req.file
        const hasSelfDescription = !!(selfDescription && selfDescription.trim())

        if(!hasResume && !hasSelfDescription){
            return res.status(400).json({ message: "Either a resume or a self description is required." })
        }

        //interview report generate by AI 
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })
        
        const interviewReport = await interviewReportModel.create({
            user:req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message:"Interview report generated",
            interviewReport
        })
    }catch(err){
        console.error("generateInterViewReportController error:", err)
        res.status(500).json({ message: "Failed to generate interview report.", error: err.message })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }