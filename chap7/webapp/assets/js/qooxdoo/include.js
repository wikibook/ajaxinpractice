function inc(pa)
{
 document.write("<script type=\"text/javascript\" src=\"../assets/js/qooxdoo/" + pa + ".js\"></script>");
};

// Core Language Additions
inc("script/core/QxMain");
inc("script/core/QxDefaultSettings");
inc("script/core/QxSettings");
inc("script/core/QxConst");
inc("script/core/QxExtend");
inc("script/core/QxNative");
inc("script/core/QxUtil");
inc("script/core/QxCompare");
inc("script/core/QxClient");

// Dom Features
inc("script/core/QxDomCore");
inc("script/core/QxDomDimension");
inc("script/core/QxDomElementFromPoint");
inc("script/core/QxDomEventRegistration");
inc("script/core/QxDomLocation");
inc("script/core/QxDomOffset");
inc("script/core/QxDomScroll");
inc("script/core/QxDomScrollIntoView");
inc("script/core/QxDomStyle");
inc("script/core/QxDomStyleSheet");
inc("script/core/QxDomWindow");
inc("script/core/QxDomIframe");
inc("script/core/QxDomElement");

// Core qooxdoo objects
inc("script/core/QxObject");
inc("script/core/QxObjectCore");

// Common qooxdoo objects
inc("script/core/QxDebug");
inc("script/core/QxTarget");

// Core Managers
inc("script/managers/QxManager");

// Application
inc("script/core/QxApplication");
inc("script/gui/QxClientWindow");

// Basic Events
inc("script/events/QxEvent");
inc("script/events/QxDomEvent");
inc("script/events/QxMouseEvent");
inc("script/events/QxMouseEventCore");
inc("script/events/QxKeyEvent");
inc("script/events/QxKeyEventCore");
inc("script/events/QxFocusEvent");
inc("script/events/QxDataEvent");

// Color Support
inc("script/managers/QxColorManager");
inc("script/gui/QxColorTheme");
inc("script/gui/QxColor");
inc("script/gui/QxColorObject");
inc("script/gui/QxColorCore");
inc("script/gui/QxColorCache");
inc("themes/colors/windowsRoyale");
inc("themes/colors/system");
inc("themes/colors/windowsClassic");
inc("themes/colors/windowsLunaBlue");
inc("themes/colors/windowsLunaGreen");
inc("themes/colors/windowsLunaSilver");

// Border Handling
inc("script/gui/QxBorder");
inc("script/gui/QxBorderObject");
inc("script/gui/QxBorderCache");
inc("script/gui/QxBorderPresets");
inc("script/gui/QxBorderObjectPresets");

// Font Handling
inc("script/gui/QxFont");
inc("script/gui/QxFontObject");
inc("script/gui/QxFontCache");

// Basic Widget
inc("script/gui/QxWidget");
inc("script/gui/QxWidgetCore");

// Appearance
inc("script/managers/QxAppearanceManager");
inc("script/gui/QxAppearanceTheme");
inc("themes/appearance/default/theme");

// Core Layouts
inc("script/layouts/QxLayoutImpl");
inc("script/layouts/QxCanvasLayoutImpl");
inc("script/layouts/QxHorizontalBoxLayoutImpl");
inc("script/layouts/QxVerticalBoxLayoutImpl");
inc("script/layouts/QxFlowLayoutImpl");
inc("script/layouts/QxDockLayoutImpl");
inc("script/layouts/QxGridLayoutImpl");

// Core Widgets
inc("script/gui/QxParent");
inc("script/widgets/QxTerminator");

// Main Widgets
inc("script/widgets/QxCanvasLayout");
inc("script/widgets/QxBlocker");
inc("script/widgets/QxClientDocument");
inc("script/widgets/QxInline");
inc("script/widgets/QxHorizontalSpacer");
inc("script/widgets/QxVerticalSpacer");

// Event Handling
inc("script/managers/QxEventManager");
inc("script/managers/QxFocusManager");

// Textile
inc("script/core/QxTextile");

// Text Fields
inc("script/widgets/QxTextField");
inc("script/widgets/QxPasswordField");
inc("script/widgets/QxTextArea");

// Timer Support
inc("script/core/QxTimer");

// XML Extras
inc("script/core/QxXmlExtras");

// Image Support
inc("script/managers/QxImageManager");
inc("script/managers/QxImagePreloaderManager");
inc("script/gui/QxImagePreloader");
inc("script/gui/QxImagePreloaderSystem");
inc("script/widgets/QxImage");
inc("script/gui/QxIconTheme");
inc("themes/icons/crystalsvg/theme");
inc("themes/icons/nuvola/theme");
inc("themes/icons/kids/theme");
inc("script/gui/QxWidgetTheme");
inc("themes/widgets/windows/theme");

// Drag&Drop Support
inc("script/events/QxDragEvent");
inc("script/managers/QxDragAndDropManager");

// Box Layout
inc("script/widgets/QxBoxLayout");
inc("script/widgets/QxVerticalBoxLayout");
inc("script/widgets/QxHorizontalBoxLayout");

// Flow Layout
inc("script/widgets/QxFlowLayout");

// Dock Layout
inc("script/widgets/QxDockLayout");

// Grid Layout
inc("script/widgets/QxGridLayout");

// Simple widgets
inc("script/widgets/QxText");
inc("script/widgets/QxHtml");
inc("script/widgets/QxLink");
inc("script/widgets/QxIconHtml");
inc("script/widgets/QxNode");

// Most used Widgets
inc("script/widgets/QxLabel");
inc("script/widgets/QxLabelCore");
inc("script/widgets/QxAtom");
inc("script/widgets/QxButton");
inc("script/widgets/QxRepeatButton");

// Radio/Checkbox Support
inc("script/managers/QxRadioManager");
inc("script/widgets/QxInputCheckIcon");
inc("script/widgets/QxCheckBox");
inc("script/widgets/QxRadioButton");

// Popup Support
inc("script/managers/QxPopupManager");
inc("script/widgets/QxPopup");
inc("script/widgets/QxPopupAtom");

// ToolTip Support
inc("script/managers/QxToolTipManager");
inc("script/widgets/QxToolTip");

// FieldSet Support
inc("script/widgets/QxFieldSet");
inc("script/widgets/QxCheckBoxFieldSet");
inc("script/widgets/QxRadioButtonFieldSet");

// Iframe Support
inc("script/widgets/QxIframe");

// Menu Support
inc("script/managers/QxMenuManager");
inc("script/layouts/QxMenuLayoutImpl");
inc("script/widgets/QxMenuLayout");
inc("script/widgets/QxMenu");
inc("script/layouts/QxMenuButtonLayoutImpl");
inc("script/widgets/QxMenuButton");
inc("script/widgets/QxMenuCheckBox");
inc("script/widgets/QxMenuRadioButton");
inc("script/widgets/QxMenuSeparator");

// ToolBar Support
inc("script/widgets/QxToolBar");
inc("script/widgets/QxToolBarPart");
inc("script/widgets/QxToolBarPartHandle");
inc("script/widgets/QxToolBarButton");
inc("script/widgets/QxToolBarSeparator");
inc("script/widgets/QxToolBarCheckBox");
inc("script/widgets/QxToolBarRadioButton");
inc("script/widgets/QxToolBarMenuButton");

// Menu Bar Support
inc("script/widgets/QxMenuBar");
inc("script/widgets/QxMenuBarButton");

// List Support
inc("script/gui/QxSelectionStorage");
inc("script/managers/QxSelectionManager");
inc("script/widgets/QxList");
inc("script/widgets/QxListItem");

// Combo Box
inc("script/widgets/QxComboBox");

// Spinner
inc("script/managers/QxRangeManager");
inc("script/widgets/QxSpinner");

// Command
inc("script/gui/QxCommand");

// Window
inc("script/managers/QxWindowManager");
inc("script/widgets/QxWindow");

// Native Window
inc("script/gui/QxNativeWindow");

// Flash Object
inc("script/gui/QxFlashPlayerVersion");
inc("script/widgets/QxFlash");

// Emulation Layers
inc("script/core/QxEmu");

// Common View
inc("script/widgets/QxCommonView");
inc("script/widgets/QxCommonViewBar");
inc("script/widgets/QxCommonViewPane");
inc("script/widgets/QxCommonViewPage");
inc("script/widgets/QxCommonViewButton");

// Tab View
inc("script/widgets/QxTabView");
inc("script/widgets/QxTabViewBar");
inc("script/widgets/QxTabViewPane");
inc("script/widgets/QxTabViewPage");
inc("script/widgets/QxTabViewButton");

// Bar View
inc("script/widgets/QxBarView");
inc("script/widgets/QxBarViewBar");
inc("script/widgets/QxBarViewPane");
inc("script/widgets/QxBarViewPage");
inc("script/widgets/QxBarViewButton");

// Tree Support
inc("script/managers/QxTreeSelectionManager");
inc("script/widgets/QxTreeElement");
inc("script/widgets/QxTreeFile");
inc("script/widgets/QxTreeFolder");
inc("script/widgets/QxTree");

// List View
inc("script/managers/QxVirtualSelectionManager");
inc("script/widgets/QxListView");
inc("script/widgets/QxListViewHeader");
inc("script/widgets/QxListViewPane");
inc("script/widgets/QxListViewHeaderCell");
inc("script/widgets/QxListViewHeaderSeparator");
inc("script/widgets/QxListViewContentCellText");
inc("script/widgets/QxListViewContentCellImage");
inc("script/widgets/QxListViewContentCellHtml");
inc("script/widgets/QxListViewContentCellLink");
inc("script/widgets/QxListViewContentCellIconHtml");

// Dom Selection Manager
inc("script/managers/QxDomSelectionManager");

// Gallery
inc("script/widgets/QxGallery");
inc("script/widgets/QxGalleryList");

// Storage
inc("script/core/QxCookie");
inc("script/core/QxCookieStorage");

// Debugging
inc("script/core/QxTimeTracker");

// Transport
inc("script/transport/QxRequest");
inc("script/transport/QxResponse");

inc("script/transport/QxRequestQueue");
inc("script/transport/QxTransport");
inc("script/transport/QxTransportCore");

inc("script/transport/QxCommonTransport");
inc("script/transport/QxXmlHttpTransport");
inc("script/transport/QxXmlHttpTransportCore");
inc("script/transport/QxIframeTransport");
inc("script/transport/QxIframeTransportCore");

// Builder
inc("script/core/QxBuilder");

// Color Selector
inc("script/gui/QxColorUtil");
inc("script/widgets/QxColorSelector");

// Data Implementation
// inc("script/data/QxData");
// inc("script/data/QxTextData");
// inc("script/data/QxHtmlData");

// Form Handling
inc("script/transport/QxFormUtils");
