import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'content/typography',
    loadComponent: () => import('@docs/content/typography/typography.component').then(m => m.TypographyComponent)
  },
  {
    path: 'components/badges',
    loadComponent: () => import('@docs/components/badges/badges.component').then(m => m.BadgesComponent)
  },
  {
    path: 'components/button-set',
    loadComponent: () => import('@docs/components/button-set/button-set.component').then(m => m.ButtonSetComponent)
  },
  {
    path: 'components/cards',
    loadComponent: () => import('@docs/components/cards/cards.component').then(m => m.CardsComponent)
  },
  {
    path: 'components/checkbox',
    loadComponent: () => import('@docs/components/checkbox/checkbox.component').then(m => m.CheckboxComponent)
  },
  {
    path: 'components/chips',
    loadComponent: () => import('@docs/components/chips/chips.component').then(m => m.ChipsComponent)
  },
  {
    path: 'components/chip-field',
    loadComponent: () => import('@docs/components/chip-field/chip-field.component').then(m => m.ChipFieldComponent)
  },
  {
    path: 'components/common-buttons',
    loadComponent: () => import('@docs/components/common-buttons/common-buttons.component').then(m => m.CommonButtonsComponent)
  },
  {
    path: 'components/tables',
    loadComponent: () => import('@docs/components/tables/tables.component').then(m => m.TablesComponent)
  },
  {
    path: 'components/datepicker',
    loadComponent: () => import('@docs/components/datepicker/datepicker.component').then(m => m.DatepickerComponent)
  },
  {
    path: 'components/dialogs',
    loadComponent: () => import('@docs/components/dialogs/dialogs.component').then(m => m.DialogsComponent)
  },
  {
    path: 'utilities/dividers',
    loadComponent: () => import('@docs/utilities/dividers/dividers.component').then(m => m.DividersComponent)
  },
  {
    path: 'components/expansion-panel',
    loadComponent: () => import('@docs/components/expansion-panel/expansion-panel.component').then(m => m.ExpansionPanelComponent)
  },
  {
    path: 'components/fab',
    loadComponent: () => import('@docs/components/fab/fab.component').then(m => m.FabComponent)
  },
  {
    path: 'components/icon-buttons',
    loadComponent: () => import('@docs/components/icon-buttons/icon-buttons.component').then(m => m.IconButtonsComponent)
  },
  {
    path: 'components/lists',
    loadComponent: () => import('@docs/components/lists/lists.component').then(m => m.ListsComponent)
  },
  {
    path: 'components/menus',
    loadComponent: () => import('@docs/components/menus/menus.component').then(m => m.MenusComponent)
  },
  {
    path: 'components/progress',
    loadComponent: () => import('@docs/components/progress/progress.component').then(m => m.ProgressComponent)
  },
  {
    path: 'components/ripple',
    loadComponent: () => import('@docs/components/ripple/ripple.component').then(m => m.RippleComponent)
  },
  {
    path: 'components/selection-controls',
    loadComponent: () => import('@docs/components/selection-controls/selection-controls.component').then(m => m.SelectionControlsComponent)
  },
  {
    path: 'components/sliders',
    loadComponent: () => import('@docs/components/sliders/sliders.component').then(m => m.SlidersComponent)
  },
  {
    path: 'components/snackbars',
    loadComponent: () => import('@docs/components/snackbars/snackbars.component').then(m => m.SnackbarsComponent)
  },
  {
    path: 'components/steppers',
    loadComponent: () => import('@docs/components/steppers/steppers.component').then(m => m.SteppersComponent)
  },
  {
    path: 'components/tabs',
    loadComponent: () => import('@docs/components/tabs/tabs.component').then(m => m.TabsComponent)
  },
  {
    path: 'components/text-fields',
    loadComponent: () => import('@docs/components/text-fields/text-fields.component').then(m => m.TextFieldsComponent)
  },
  {
    path: 'components/select',
    loadComponent: () => import('@docs/components/select/select.component').then(m => m.SelectComponent)
  },
  {
    path: 'components/typeahead',
    loadComponent: () => import('@docs/components/typeahead/typeahead.component').then(m => m.TypeaheadComponent)
  },
  {
    path: 'components/toolbars',
    loadComponent: () => import('@docs/components/toolbars/toolbars.component').then(m => m.ToolbarsComponent)
  },
  {
    path: 'layout/container',
    loadComponent: () => import('@docs/layout/container/container.component').then(m => m.ContainerComponent)
  },
  {
    path: 'layout/grid',
    loadComponent: () => import('@docs/layout/grid/grid.component').then(m => m.GridComponent)
  },
  {
    path: 'utilities/background-colors',
    loadComponent: () => import('@docs/utilities/background-colors/background-colors.component').then(m => m.BackgroundColorsComponent)
  },
  {
    path: 'utilities/text-and-background-colors',
    loadComponent: () => import('@docs/utilities/text-and-background-colors/text-and-background-colors.component').then(m => m.TextAndBackgroundColorsComponent)
  },
  {
    path: 'utilities/text-colors',
    loadComponent: () => import('@docs/utilities/text-colors/text-colors.component').then(m => m.TextColorsComponent)
  },
  {
    path: 'utilities/text-emphasis',
    loadComponent: () => import('@docs/utilities/text-emphasis/text-emphasis.component').then(m => m.TextEmphasisComponent)
  },
  {
    path: '',
    loadComponent: () => import('@docs/introduction/introduction.component').then(m => m.IntroductionComponent)
  }
];
