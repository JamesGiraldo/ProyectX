import * as moment from "moment";
import { FormGroup } from "@angular/forms";

export class Utilities {
  /**
   * @descprtion  mark as dirty all controls of a form
   */
  public static markAsDirty(form: FormGroup) {
    let controlKeys;
    controlKeys = Object.keys(form.controls);
    controlKeys.forEach((key) => {
      let control;
      control = form.controls[key];
      control.markAsDirty();
    });
  }
  public static resetForm(form: FormGroup) {
    let controlKeys;
    controlKeys = Object.keys(form.controls);
    controlKeys.forEach((key) => {
      let control;
      control = form.controls[key];
      control.setValue("");
    });
  }
  /**
   * @description from datePicker format to unix format
   */
  public static formatDate(date: any) {
    let formatStart: any = "";
    let year: any = "";
    let month: any = "";
    let day: any = "";

    if (date !== "") {
      formatStart = moment.unix(Number(date)).toDate();
      formatStart = moment(formatStart);

      year = formatStart.format("YYYY");
      month = formatStart.format("MM");
      day = formatStart.format("DD");
    }

    if (year !== "") {
      year = parseInt(year, null);
    }

    if (month !== "") {
      month = parseInt(month, null);
    }

    if (day !== "") {
      day = parseInt(day, null);
    }

    // tslint:disable-next-line:object-literal-shorthand
    return { year: year, month: month, day: day };
  }
  /**
   * @description  unix format to standar format 'YYYY/MM/DD's
   */
  public static unixToDate(date: any) {
    let formatStart: any = "";

    if (date !== "") {
      formatStart = moment.unix(Number(date)).toDate();
      formatStart = moment(formatStart).format("YYYY-MM-DD");
    }
  }
}
