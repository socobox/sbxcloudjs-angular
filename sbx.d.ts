// Type definitions for Summernote v0.8.2
// Project: http://summernote.org/deep-dive/#initialization-options
// Definitions by: Wouter Staelens https://github.com/wstaelens/
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface SbxOptions {
    airMode?: boolean;
    buttons?: any;
    callbacks?: any; // todo
    codemirror?: CodemirrorOptions;
    colors?: colorsDef;
    dialogsInBody?: boolean;
    dialogsFade?: boolean;
    direction?: string;
    disableDragAndDrop?: boolean;
    focus?: boolean;
    fontNames?: string[];
    fontNamesIgnoreCheck?: string[];
    height?: number;
    hint?: HintOptions;
    icons?: IconsOptions;
    insertTableMaxSize?: InsertTableMaxSizeOptions;
    keyMap?: KeyMapOptions;
    lang?: string;
    lineHeights?: string[];
    minHeight?: number;
    maxHeight?: number;
    maximumImageFileSize?: any;
    modules?: ModuleOptions;
    popover?: PopoverOptions;
    placeholder?: string;
    shortcuts?: boolean;
    styleTags?: styleTagsOptions[];
    styleWithSpan?: boolean;
    tabsize?: number;
    tableClassName?: string;
    textareaAutoSync?: boolean;
    toolbar?: toolbarDef;
    tooltip?: boolean;
    width?: number;
}

// callbacks ?
// https://www.typescriptlang.org/docs/handbook/functions.html#writing-the-function-type
// type OptionsDef = {
//    callbacks?: {
//        [event: string]: () => void
//    }
// };


type toolbarStyleGroupOptions = 'style' | 'bold' | 'italic' | 'underline' | 'clear';
type toolbarFontGroupOptions = 'strikethrough' | 'superscript' | 'subscript';
type toolbarFontsizeGroupOptions = 'fontsize';
type toolbarColorGroupOptions = 'color';
type toolbarParaGroupOptions = 'ul' | 'ol' | 'paragraph';
type toolbarHeightGroupOptions = 'height';
type toolbarTableGroupOptions = 'table';
type toolbarInsertGroupOptions = 'link' | 'picture' | 'hr';
type toolbarViewGroupOptions = 'fullscreen' | 'codeview';
type toolbarHelpGroupOptions = 'help';
type toolbarDef = [string, string[]][];
// type toolbarDef = [
//    ['style', toolbarStyleGroupOptions[]]
//    | ['font', toolbarFontGroupOptions[]]
//    | ['fontsize', toolbarFontsizeGroupOptions[]]
//    | ['color', toolbarColorGroupOptions[]]
//    | ['para', toolbarParaGroupOptions[]]
//    | ['height', toolbarHeightGroupOptions[]]
//    | ['table', toolbarTableGroupOptions[]]
//    | ['insert', toolbarInsertGroupOptions[]]
//    | ['view', toolbarViewGroupOptions[]]
//    | ['help', toolbarHelpGroupOptions[]]
// ];



type colorsDef = [string[]][];
type styleTagsOptions = 'p' | 'blockquote' | 'pre' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface InsertTableMaxSizeOptions {
    col: number;
    row: number;
}

interface IconsOptions {
    options?: any; // todo
}

interface KeyMapOptions {
    pc?: KeyMapPcOptions;
    mac?: KeyMapMacOptions;
}

interface KeyMapPcOptions {
    options?: any; // todo
}

interface KeyMapMacOptions {
    options?: any; // todo
}

interface HintOptions {
    words?: string[];
    mentions?: string[];
    match: RegExp;
    search: Function;
    template?: Function;
    content?: Function;
}

interface CodemirrorOptions {
    mode?: string;
    htmlNode?: boolean;
    lineNumbers?: boolean;
    theme?: string;
}

type popoverImageOptionsImagesize = 'imageSize100' | 'imageSize50' | 'imageSize25';
type popoverImageOptionsFloat = 'floatLeft' | 'floatRight' | 'floatNone';
type popoverImageOptionsRemove = 'removeMedia';
type popoverImageDef = [
    ['imagesize', popoverImageOptionsImagesize[]],
    ['float', popoverImageOptionsFloat[]],
    ['remove', popoverImageOptionsRemove[]]
];

type popoverLinkLinkOptions = 'linkDialogShow' | 'unlink';
type popoverLinkDef = [
    ['link', popoverLinkLinkOptions[]]
];

type popoverAirOptionsColor = 'color';
type popoverAirOptionsFont = 'bold' | 'underline' | 'clear';
type popoverAirOptionsPara = 'ul' | 'paragraph';
type popoverAirOptionsTable = 'table';
type popoverAirOptionsInsert = 'link' | 'picture';
type popoverAirDef = [
    ['color', popoverAirOptionsColor],
    ['font', popoverAirOptionsFont],
    ['para', popoverAirOptionsPara],
    ['table', popoverAirOptionsTable],
    ['insert', popoverAirOptionsInsert]
];

interface PopoverOptions {
    image?: popoverImageDef;
    link?: popoverLinkDef;
    air?: popoverAirDef;
}

interface ModuleOptions {
    options?: any; // todo
}

interface CreateLinkOptions {
    text: string;
    url: string;
    newWindow: boolean;
}



declare module 'sbxangular' {
}
