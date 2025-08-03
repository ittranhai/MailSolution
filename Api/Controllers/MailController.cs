using MailSolution.Api.Models;
using MailSolution.Api.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Dynamic;
using System.Text;
using System.Text.Json;
namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class MailController : ControllerBase
{
    private readonly IMailService _mailService;
    private readonly IViewRenderService _viewRenderService;
    public MailController(IMailService mailService, IViewRenderService viewRenderService)
    {
        _mailService = mailService;
        _viewRenderService = viewRenderService;
    }

    [AllowAnonymous]
    [HttpPost("Send")]
    public async Task<IActionResult> TestSendMail([FromBody] SendMailModel model)
    {
        //string json = "{\"Name\":\"Alice\",\"Age\":30}";
        var data = JsonSerializer.Deserialize<ExpandoObject>(model.JsonBody);
        if (data != null)
        {
            var result = await _viewRenderService.RenderToStringAsync(model.TemplateName, data);
            if (!string.IsNullOrEmpty(result)) 
            {
                MailModel mailModel = new MailModel
                {
                    ToEmail = model.ToEmail,
                    Subject = model.Subject,
                    Body = result
                };
                await _mailService.SendEmailAsync(mailModel);
                return Ok();
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
    
}
