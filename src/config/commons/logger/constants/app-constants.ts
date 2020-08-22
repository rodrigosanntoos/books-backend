export class AppConstants {
  public static readonly DEFAULT_DATE_FORMAT = process.env.DEFAULT_DATE_FORMAT || 'DD/MM/YYYY'
  public static readonly DEFAULT_TIME_FORMAT = process.env.DEFAULT_DATE_FORMAT || 'HH:mm'
  public static readonly GMT_TIME = Number(process.env.GMT_TIME || '-3')
  public static readonly ENCRYPT_SECRET = process.env.CRYPT_SECRET || 'rM67chvbBBSK1BW6qeF019ss1LpUwm4V'
}
