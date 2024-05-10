import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'content/typography',
    loadComponent: () => import('@docs/content/typography/typography.component').then(c => c.TypographyComponent)
  },
  {
    path: 'components/button-set',
    loadComponent: () => import('@docs/components/button-set/button-set.component').then(c => c.ButtonSetComponent)
  },
  {
    path: 'components/cards',
    loadComponent: () => import('@docs/components/cards/cards.component').then(c => c.CardsComponent)
  },
  {
    path: 'components/checkbox',
    loadComponent: () => import('@docs/components/checkbox/checkbox.component').then(c => c.CheckboxComponent)
  },
  {
    path: 'components/chips',
    loadComponent: () => import('@docs/components/chips/chips.component').then(c => c.ChipsComponent)
  },
  {
    path: 'components/chip-field',
    loadComponent: () => import('@docs/components/chip-field/chip-field.component').then(c => c.ChipFieldComponent)
  },
  {
    path: 'components/common-buttons',
    loadComponent: () => import('@docs/components/common-buttons/common-buttons.component').then(c => c.CommonButtonsComponent)
  },
  {
    path: 'components/tables',
    loadComponent: () => import('@docs/components/tables/tables.component').then(c => c.TablesComponent)
  },
  {
    path: 'components/datepicker',
    loadComponent: () => import('@docs/components/datepicker/datepicker.component').then(c => c.DatepickerComponent)
  },
  {
    path: 'components/dialogs',
    loadComponent: () => import('@docs/components/dialogs/dialogs.component').then(c => c.DialogsComponent)
  },
  {
    path: 'utilities/dividers',
    loadComponent: () => import('@docs/utilities/dividers/dividers.component').then(c => c.DividersComponent)
  },
  {
    path: 'components/expansion-panel',
    loadComponent: () => import('@docs/components/expansion-panel/expansion-panel.component').then(c => c.ExpansionPanelComponent)
  },
  {
    path: 'components/fab',
    loadComponent: () => import('@docs/components/fab/fab.component').then(c => c.FabComponent)
  },
  {
    path: 'components/icon-buttons',
    loadComponent: () => import('@docs/components/icon-buttons/icon-buttons.component').then(c => c.IconButtonsComponent)
  },
  {
    path: 'components/lists',
    loadComponent: () => import('@docs/components/lists/lists.component').then(c => c.ListsComponent)
  },
  {
    path: 'components/menus',
    loadComponent: () => import('@docs/components/menus/menus.component').then(c => c.MenusComponent)
  },
  {
    path: 'components/progress',
    loadComponent: () => import('@docs/components/progress/progress.component').then(c => c.ProgressComponent)
  },
  {
    path: 'components/ripple',
    loadComponent: () => import('@docs/components/ripple/ripple.component').then(c => c.RippleComponent)
  },
  {
    path: 'components/selection-controls',
    loadComponent: () => import('@docs/components/selection-controls/selection-controls.component').then(c => c.SelectionControlsComponent)
  },
  {
    path: 'components/sliders',
    loadComponent: () => import('@docs/components/sliders/sliders.component').then(c => c.SlidersComponent)
  },
  {
    path: 'components/snackbars',
    loadComponent: () => import('@docs/components/snackbars/snackbars.component').then(c => c.SnackbarsComponent)
  },
  {
    path: 'components/steppers',
    loadComponent: () => import('@docs/components/steppers/steppers.component').then(c => c.SteppersComponent)
  },
  {
    path: 'components/tabs',
    loadComponent: () => import('@docs/components/tabs/tabs.component').then(c => c.TabsComponent)
  },
  {
    path: 'components/text-fields',
    loadComponent: () => import('@docs/components/text-fields/text-fields.component').then(c => c.TextFieldsComponent)
  },
  {
    path: 'components/toolbars',
    loadComponent: () => import('@docs/components/toolbars/toolbars.component').then(c => c.ToolbarsComponent)
  },
  {
    path: 'layout/container',
    loadComponent: () => import('@docs/layout/container/container.component').then(c => c.ContainerComponent)
  },
  {
    path: 'layout/grid',
    loadComponent: () => import('@docs/layout/grid/grid.component').then(c => c.GridComponent)
  },
  {
    path: 'utilities/background-colors',
    loadComponent: () => import('@docs/utilities/background-colors/background-colors.component').then(c => c.BackgroundColorsComponent)
  },
  {
    path: 'utilities/text-and-background-colors',
    loadComponent: () => import('@docs/utilities/text-and-background-colors/text-and-background-colors.component').then(c => c.TextAndBackgroundColorsComponent)
  },
  {
    path: 'utilities/text-colors',
    loadComponent: () => import('@docs/utilities/text-colors/text-colors.component').then(c => c.TextColorsComponent)
  },
  {
    path: 'utilities/text-emphasis',
    loadComponent: () => import('@docs/utilities/text-emphasis/text-emphasis.component').then(c => c.TextEmphasisComponent)
  },
  {
    path: '',
    loadComponent: () => import('@docs/introduction/introduction.component').then(c => c.IntroductionComponent)
  }
];
