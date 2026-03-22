import { useContext } from "react"
import { generateInterviewReportApi, getInterviewReportByIdApi, getAllInterviewReportsApi, getResumePdfApi } from "../services/interview.api"
import { InterviewContext } from "../interview.context"

//this is our custom hook
export const useInterview = () => {
    const context = useContext(InterviewContext)

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading,setLoading,report,setReport,reports,setReports} = context

    const generateReport = async ({jobDescription,selfDescription,resume}) => {
        setLoading(true)
        try{
            const data = await generateInterviewReportApi({jobDescription,selfDescription,resume})
            setReport(data.interviewReport)
            return data.interviewReport
        }catch(err){
            console.error(err)
            throw err
        }finally{
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try{
            const data = await getInterviewReportByIdApi(interviewId)
            setReport(data.interviewReport)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const getAllReports = async () => {
        setLoading(true)
        try{
            const data = await getAllInterviewReportsApi()
            setReports(data.interviewReports)
        }catch(err){
            console.log(err)
        }finally{
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewReportId) => {
        try{
            const blob = await getResumePdfApi(interviewReportId)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `resume_${interviewReportId}.pdf`
            a.click()
            window.URL.revokeObjectURL(url)
        }catch(err){
            console.log(err)
        }
    }

    return { loading, report, reports, generateReport, getReportById, getAllReports, getResumePdf }
}