// import createNumberMask from 'text-mask-addons/dist/createNumberMask';
export class RegexUtils {
  public static _rxEmail: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  public static _password: RegExp = /^(?=.*[a-zA-Z])(?=.*[\d])(?!.*\s).{6,20}$/;
  public static _username: RegExp = /^([a-z0-9]+(?:[\_\-\.][a-z0-9]+)*){6,60}$/;

  public static _rxUnits: RegExp = /^\d+(\.\d)?\d*$/;
  public static _rxNumber: RegExp = /^\d+$/;
  public static _rxCurrency: RegExp = /^(\d|,|\$)+(\.\d)?\d*$/;

  public static _rxPhone: RegExp = /^(\+)*\d+$/;

  public static _creditCard: RegExp = /^((36)\d{12}|(4)\d{12}|(4)\d{15}|(51|52|53|54|55)\d{14}|(34|37)\d{13})$/;
  // public static _creditCard: RegExp = /^(((34|37)\d{13})|((36)\d{12})|((4)\d{12})|((4)\d{15})|((51|52|53|54|55)\d{14}))$/;

  private static _valPhone1: RegExp = new RegExp("[\\+\\d]");
  private static _valPhone2: RegExp = new RegExp("\\d");
  public static _maskPhone = {
    A: { pattern: RegexUtils._valPhone1 },
    B: { pattern: RegexUtils._valPhone2 },
    optional: false,
  };
}
