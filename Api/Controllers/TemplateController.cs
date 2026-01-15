using HiQPdf;
using MailSolution.Api.Models;
using MailSolution.Api.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Dynamic;
using System.Text;
namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TemplateController : ControllerBase
{
    private readonly IViewRenderService _viewRenderService;
    public TemplateController(IViewRenderService viewRenderService)
    {
        _viewRenderService = viewRenderService;
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult Create([FromBody] CreateTemplateModel model)
    {
        string fileView = $"Views/{model.TemplateName}.cshtml";
        string fileModel = $"MailModels/{model.TemplateName}.txt";
        try
        {
            if (!Directory.Exists(GetPathCombine("Views")) && !Directory.Exists(GetPathCombine("MailModels")))
            {
                Directory.CreateDirectory(GetPathCombine("Views"));
                Directory.CreateDirectory(GetPathCombine("MailModels"));
            }

            // Save the a file to views folder
            System.IO.File.WriteAllText(GetPathCombine(fileView), model.Content, Encoding.UTF8);
            // Save the a file to views MailModels
            System.IO.File.WriteAllText(GetPathCombine(fileModel), model.JsonModel, Encoding.UTF8);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

    }
    [AllowAnonymous]
    [HttpGet]
    public IActionResult GetAllTemplate()
    {
        string folderModels = @"MailModels";
        string folderView = @"Views";
        if (Directory.Exists(GetPathCombine(folderModels)) && Directory.Exists(GetPathCombine(folderView)))
        {
            string[] files = Directory.GetFiles(GetPathCombine(folderModels));
            List<TemplateModel> templates = new List<TemplateModel>();

            foreach (string filePath in files)
            {
                string fileName = Path.GetFileName(filePath);
                fileName = fileName.Replace(".txt", "");
                var tempalte = new TemplateModel
                {
                    TemplateName = fileName,
                    JsonModel = System.IO.File.ReadAllText(GetPathCombine(folderModels + "/" + fileName + ".txt"), Encoding.UTF8),
                    Content = System.IO.File.ReadAllText(GetPathCombine(folderView + "/" + fileName + ".cshtml"), Encoding.UTF8)
                };
                templates.Add(tempalte);
            }
            return Ok(templates);
        }
        else
        {
            return Ok(new List<string>());
        }
    }
    private string GetPathCombine(string path)
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, path);
    }
    [AllowAnonymous]
    [HttpPost("Render")]
    public async Task<IActionResult> TestSendMail([FromBody] TemplateModel model)
    {
        var data = JsonConvert.DeserializeObject<ExpandoObject>(model.JsonModel);
        if (data != null)
        {
            var result = await _viewRenderService.RenderToStringAsync(model.TemplateName, data);
            if (!string.IsNullOrEmpty(result)) 
            {
                return Ok(new
                {
                    Content = result,
                });
            }
            else
            {
                return BadRequest("can not render template");
            }
        }
        else
        {
            return BadRequest("JsonBody Error");
        }
        
    }
    [AllowAnonymous]
    [HttpPost("ExportPDF")]
    public async Task<IActionResult> ExportPDF([FromBody] TemplateModel model)
    {
        var data = JsonConvert.DeserializeObject<ExpandoObject>(model.JsonModel);
        if (data != null)
        {
            var result = await _viewRenderService.RenderToStringAsync(model.TemplateName, data);
            if (!string.IsNullOrEmpty(result)) 
            {
                HtmlToPdf converter = new HtmlToPdf();
                converter.Document.PageSize = PdfPageSize.A4;
                converter.Document.PageOrientation = PdfPageOrientation.Portrait;

                // ===== MARGIN =====
                converter.Document.Margins = new PdfMargins(0);

                // ===== KHÔNG SCALE =====
                converter.Document.FitPageWidth = false;
                converter.Document.FitPageHeight = false;

                // ===== VIEWPORT (QUAN TRỌNG) =====
                converter.BrowserWidth = 1024;


                var htmlToPdfData = converter.ConvertHtmlToMemory(result, null);
                var content = new MemoryStream(htmlToPdfData);
                return File(content, "application/pdf", model.TemplateName + ".pdf");
            }
            else
            {
                return BadRequest("can not ExportPDF");
            }
        }
        else
        {
            return BadRequest("JsonBody Error");
        }
        
    }
    
}
