import { Injectable } from "@angular/core";
import { EMPTY } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReleaseService {
  quickSearch(term: string) {
    return EMPTY;
  }
}
