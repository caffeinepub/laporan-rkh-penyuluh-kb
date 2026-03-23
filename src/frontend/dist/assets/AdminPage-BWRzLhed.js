import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, P as Primitive, u as useComposedRefs, d as cn, x as useGetAllUserProfiles, y as useGetAllReports, g as LoaderCircle, z as useGetAllUserTokens, A as useGetAllUserProfilesWithPrincipals, C as useSetUserToken, B as Button, I as Input, h as ue } from "./index-CtDMh7-u.js";
import { c as createContextScope, b as useId, d as composeEventHandlers, u as useControllableState, h as useCallbackRef, f as formatTanggal, B as BULAN_ID } from "./date-BIKLN_jN.js";
import { c as createCollection, u as useDirection } from "./index-DE4wsg2F.js";
import { P as Presence, K as KeyRound } from "./index-CPt0ka-k.js";
import { F as FileText } from "./file-text-LakE8VmO.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = createLucideIcon("users", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function AdminPage() {
  const { data: profiles = [], isLoading: profilesLoading } = useGetAllUserProfiles();
  const { data: reports = [], isLoading: reportsLoading } = useGetAllReports();
  const [activeTab, setActiveTab] = reactExports.useState("users");
  const userReportCounts = profiles.map((p) => {
    const userReports = reports.filter((r) => r.user.toString() === p.nip);
    return { ...p, count: userReports.length };
  });
  const sortedReports = [...reports].sort(
    (a, b) => b.tanggal.localeCompare(a.tanggal)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg shadow-card overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-6 py-4 border-b border-brand-border",
        style: {
          background: "linear-gradient(135deg, #1F8A63 0%, #2AA08A 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-white", children: "Panel Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-xs mt-0.5", children: "Kelola pengguna dan laporan seluruh penyuluh KB" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "users",
            "data-ocid": "admin.users.tab",
            className: "flex items-center gap-1.5 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 13 }),
              " Pengguna"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "reports",
            "data-ocid": "admin.reports.tab",
            className: "flex items-center gap-1.5 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 13 }),
              " Semua Laporan"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "rekap",
            "data-ocid": "admin.rekap.tab",
            className: "flex items-center gap-1.5 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 13 }),
              " Rekap"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "tokens",
            "data-ocid": "admin.tokens.tab",
            className: "flex items-center gap-1.5 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 13 }),
              " Token Akses"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "users", children: profilesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.users.loading_state",
          className: "flex justify-center py-12",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-brand-green", size: 24 })
        }
      ) : profiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.users.empty_state",
          className: "text-center py-12",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand-muted", children: "Belum ada pengguna terdaftar" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.users.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-xs font-semibold text-brand-muted uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Nama" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "NIP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden md:table-cell", children: "Jabatan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden lg:table-cell", children: "Wilayah Kerja" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden lg:table-cell", children: "Unit Kerja" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Total Laporan" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-brand-border", children: profiles.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin.users.item.${idx + 1}`,
            className: "hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-brand-muted", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: p.nama }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-brand-muted text-xs", children: p.nip }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-xs", children: p.jabatan }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell text-xs", children: p.wilayahKerja }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell text-xs", children: p.unitKerja }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block px-2 py-0.5 rounded-full text-xs font-semibold",
                  style: {
                    backgroundColor: "#DFF3E8",
                    color: "#2E7D5B"
                  },
                  children: reports.filter((r) => r.user.toString() === p.nip).length
                }
              ) })
            ]
          },
          p.nip
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "reports", children: reportsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.reports.loading_state",
          className: "flex justify-center py-12",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-brand-green", size: 24 })
        }
      ) : sortedReports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "admin.reports.empty_state",
          className: "text-center py-12",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand-muted", children: "Belum ada laporan" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.reports.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-xs font-semibold text-brand-muted uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Tanggal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Kegiatan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden md:table-cell", children: "Sasaran" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden md:table-cell", children: "Lokasi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden lg:table-cell", children: "Hasil" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-brand-border", children: sortedReports.slice(0, 50).map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin.reports.item.${idx + 1}`,
            className: "hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-brand-muted", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap text-xs", children: formatTanggal(r.tanggal) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2 text-xs", children: r.kegiatan }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-block px-2 py-0.5 rounded-full text-xs",
                  style: {
                    backgroundColor: "#DFF3E8",
                    color: "#2E7D5B"
                  },
                  children: r.sasaran
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-xs text-brand-muted", children: r.lokasi }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1 text-xs text-brand-muted", children: r.hasilKegiatan }) })
            ]
          },
          r.id.toString()
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rekap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
          {
            label: "Total Pengguna",
            value: profiles.length,
            color: "#2B4C6F"
          },
          {
            label: "Total Laporan",
            value: reports.length,
            color: "#2E7D5B"
          },
          {
            label: "Laporan Bulan Ini",
            value: reports.filter((r) => {
              const d = /* @__PURE__ */ new Date();
              const m = String(d.getMonth() + 1).padStart(2, "0");
              const y = String(d.getFullYear());
              const [ry, rm] = r.tanggal.split("-");
              return rm === m && ry === y;
            }).length,
            color: "#1F8A63"
          },
          {
            label: "Rata-rata per User",
            value: profiles.length > 0 ? Math.round(reports.length / profiles.length) : 0,
            color: "#6B7785"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-brand-bg rounded-lg p-4 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", style: { color: s.color }, children: s.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand-muted mt-1", children: s.label })
            ]
          },
          s.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-brand-bg rounded-lg p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-brand-nav mb-3", children: "Laporan per Bulan (Tahun Ini)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2", children: BULAN_ID.slice(0, 12).map((nama, idx) => {
            const m = String(idx + 1).padStart(2, "0");
            const y = String((/* @__PURE__ */ new Date()).getFullYear());
            const count = reports.filter((r) => {
              const [ry, rm] = r.tanggal.split("-");
              return rm === m && ry === y;
            }).length;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-white rounded p-2 text-center shadow-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand-muted", children: nama.slice(0, 3) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-brand-green", children: count })
                ]
              },
              nama
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.rekap.table", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-xs font-semibold text-brand-muted uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "No" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Nama Penyuluh" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden md:table-cell", children: "Jabatan" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden md:table-cell", children: "Wilayah Kerja" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Total Laporan" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-brand-border", children: userReportCounts.sort((a, b) => b.count - a.count).map((u, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              "data-ocid": `admin.rekap.item.${idx + 1}`,
              className: "hover:bg-gray-50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-brand-muted", children: idx + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: u.nama }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-xs text-brand-muted", children: u.jabatan }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-xs text-brand-muted", children: u.wilayahKerja }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-block px-2 py-0.5 rounded-full text-xs font-semibold",
                    style: {
                      backgroundColor: "#DFF3E8",
                      color: "#2E7D5B"
                    },
                    children: u.count
                  }
                ) })
              ]
            },
            u.nip
          )) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tokens", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TokenAksesTab,
        {
          profiles,
          profilesLoading
        }
      ) })
    ] })
  ] });
}
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
function TokenAksesTab({
  profiles,
  profilesLoading
}) {
  const {
    data: tokenEntries = [],
    isLoading: tokensLoading,
    refetch
  } = useGetAllUserTokens();
  const { data: profilesWithPrincipals = [] } = useGetAllUserProfilesWithPrincipals();
  const setTokenMutation = useSetUserToken();
  const [editingNip, setEditingNip] = reactExports.useState(null);
  const [tokenInputs, setTokenInputs] = reactExports.useState({});
  const handleSave = async (profile) => {
    const newToken = tokenInputs[profile.nip] ?? "";
    if (!newToken.trim()) {
      ue.error("Token tidak boleh kosong");
      return;
    }
    const entry = profilesWithPrincipals.find(
      (e) => e.profile.nip === profile.nip
    );
    if (!entry) {
      ue.error(
        "Tidak dapat menemukan data pengguna. Pastikan pengguna sudah login minimal sekali."
      );
      return;
    }
    try {
      await setTokenMutation.mutateAsync({
        user: entry.user,
        token: newToken.trim()
      });
      ue.success(`Token untuk ${profile.nama} berhasil disimpan`);
      setEditingNip(null);
      refetch();
    } catch {
      ue.error("Gagal menyimpan token");
    }
  };
  if (profilesLoading || tokensLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.tokens.loading_state",
        className: "flex justify-center py-12",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-brand-green", size: 24 })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-brand-muted", children: "Kelola token akses unik untuk setiap pengguna. Token digunakan untuk verifikasi saat masuk dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          className: "text-xs",
          onClick: () => refetch(),
          "data-ocid": "admin.tokens.secondary_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12, className: "mr-1" }),
            " Refresh"
          ]
        }
      )
    ] }),
    profiles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "admin.tokens.empty_state", className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-brand-muted", children: "Belum ada pengguna terdaftar" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "admin.tokens.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-xs font-semibold text-brand-muted uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Nama" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left hidden md:table-cell", children: "NIP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Token" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-brand-border", children: profiles.map((p, idx) => {
        var _a;
        const isEditing = editingNip === p.nip;
        const principalEntry = profilesWithPrincipals.find(
          (e) => e.profile.nip === p.nip
        );
        const currentToken = principalEntry ? (_a = tokenEntries.find(
          (e) => e.user.toString() === principalEntry.user.toString()
        )) == null ? void 0 : _a.token : void 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin.tokens.item.${idx + 1}`,
            className: "hover:bg-gray-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-brand-muted", children: idx + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: p.nama }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-xs text-brand-muted", children: p.nip }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "admin.tokens.input",
                    className: "h-8 text-xs font-mono w-40",
                    value: tokenInputs[p.nip] ?? "",
                    onChange: (e) => setTokenInputs((prev) => ({
                      ...prev,
                      [p.nip]: e.target.value
                    })),
                    placeholder: "Masukkan token"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "h-8 text-xs",
                    onClick: () => {
                      const gen = generateToken();
                      setTokenInputs((prev) => ({
                        ...prev,
                        [p.nip]: gen
                      }));
                    },
                    "data-ocid": "admin.tokens.secondary_button",
                    title: "Generate token acak",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `font-mono text-xs px-2 py-1 rounded ${currentToken ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`,
                  children: currentToken ?? "Belum diatur"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    className: "h-8 text-xs",
                    onClick: () => handleSave(p),
                    disabled: setTokenMutation.isPending,
                    "data-ocid": "admin.tokens.save_button",
                    style: { background: "#1F8A63", color: "#fff" },
                    children: setTokenMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }) : "Simpan"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "h-8 text-xs",
                    onClick: () => setEditingNip(null),
                    "data-ocid": "admin.tokens.cancel_button",
                    children: "Batal"
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  className: "h-8 text-xs",
                  onClick: () => {
                    setEditingNip(p.nip);
                    setTokenInputs((prev) => ({
                      ...prev,
                      [p.nip]: currentToken ?? ""
                    }));
                  },
                  "data-ocid": "admin.tokens.edit_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 12, className: "mr-1" }),
                    "Set Token"
                  ]
                }
              ) })
            ]
          },
          p.nip
        );
      }) })
    ] }) })
  ] });
}
export {
  AdminPage as default
};
