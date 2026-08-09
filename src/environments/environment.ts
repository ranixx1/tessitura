import { CommonModule } from "@angular/common";
import { CardComponent } from "../app/shared/components/card/card";
import { InputComponent } from "../app/shared/components/input/input";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ButtonComponent } from "../app/shared/components/button/button";

export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  imports: [
  CommonModule,
  ReactiveFormsModule,
  RouterLink,
  ButtonComponent,
  InputComponent,
  CardComponent
]
};