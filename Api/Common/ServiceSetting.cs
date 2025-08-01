namespace MailSolution.Api.Common;
public class ServiceSetting
{
    public string? ServiceName {get;set;}
    public required ServiceSettingMail MailSetting {get;set;}
}

public class ServiceSettingMail
{
    public required string Mail { get; set; }
    public required string DisplayName { get; set; }
    public required string Password { get; set; }
    public required string Host { get; set; }
    public int Port { get; set; }
}