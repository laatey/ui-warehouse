import React, { useState } from 'react';
import { PanelRightClose, PanelRightOpen, ArrowLeft } from 'lucide-react';
import { InboxWorkspaceShellProps } from './types';

export const InboxWorkspaceShell: React.FC<InboxWorkspaceShellProps> = ({
  navRailSlot,
  navRailWidth = 220,
  conversationListSlot,
  conversationListWidth = 340,
  showConversationList: controlledShowConversationList,
  onToggleConversationList,
  contactSidebarSlot,
  contactSidebarWidth = 320,
  showContactSidebar: controlledShowContactSidebar,
  onToggleContactSidebar,
  conversationHeaderSlot,
  composerSlot,
  children,
  activeConversationId,
  className = '',
}) => {
  const [internalShowList, setInternalShowList] = useState(true);
  const [internalShowSidebar, setInternalShowSidebar] = useState(true);

  const showList = controlledShowConversationList !== undefined ? controlledShowConversationList : internalShowList;
  const showSidebar = controlledShowContactSidebar !== undefined ? controlledShowContactSidebar : internalShowSidebar;

  const toggleSidebar = () => {
    if (onToggleContactSidebar) onToggleContactSidebar();
    else setInternalShowSidebar(!internalShowSidebar);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-foreground ${className}`}>
      {/* 1. Left Channel / Navigation Rail */}
      {navRailSlot && (
        <aside
          style={{ width: `${navRailWidth}px` }}
          className="shrink-0 border-r border-border bg-card flex flex-col z-20"
          aria-label="Inbox Navigation"
        >
          {navRailSlot}
        </aside>
      )}

      {/* 2. Middle Conversation List */}
      {conversationListSlot && (
        <div
          style={{ width: `${conversationListWidth}px` }}
          className={`shrink-0 border-r border-border bg-background flex flex-col transition-all duration-200 z-10 ${
            activeConversationId && !showList ? 'hidden md:flex' : 'flex w-full md:w-auto'
          }`}
          aria-label="Conversation List"
        >
          {conversationListSlot}
        </div>
      )}

      {/* 3. Center Active Conversation Stage */}
      <div
        className={`flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative ${
          !activeConversationId && !showList ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Header Bar */}
        <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            {/* Mobile back to list button */}
            <button
              type="button"
              onClick={onToggleConversationList || (() => setInternalShowList(true))}
              className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {conversationHeaderSlot || (
              <span className="font-semibold text-sm">Conversation</span>
            )}
          </div>

          {contactSidebarSlot && (
            <button
              type="button"
              onClick={toggleSidebar}
              className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                showSidebar ? 'bg-muted text-foreground' : ''
              }`}
              title="Toggle Contact Details"
              aria-label="Toggle Contact Details"
            >
              {showSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Message Thread Container (Neutral Blank) */}
        <main className="flex-1 overflow-auto p-4 flex flex-col">
          {children}
        </main>

        {/* Bottom Composer Area */}
        {composerSlot && (
          <div className="p-3 border-t border-border bg-card shrink-0">
            {composerSlot}
          </div>
        )}
      </div>

      {/* 4. Rightmost Contact / Context Sidebar */}
      {contactSidebarSlot && (
        <aside
          style={{ width: showSidebar ? `${contactSidebarWidth}px` : 0 }}
          className="shrink-0 border-l border-border bg-card overflow-hidden transition-all duration-200 flex flex-col z-10"
          aria-label="Contact Information"
        >
          <div style={{ width: `${contactSidebarWidth}px` }} className="h-full flex flex-col">
            {contactSidebarSlot}
          </div>
        </aside>
      )}
    </div>
  );
};
