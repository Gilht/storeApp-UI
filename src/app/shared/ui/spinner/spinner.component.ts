import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  isLoading$ = inject(SpinnerService).isLoading$;
}
