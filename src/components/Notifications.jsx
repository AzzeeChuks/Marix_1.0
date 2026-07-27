import React from 'react';

// 🚀 DYNAMIC RELATIVE TIME CALCULATOR
function formatTimeAgo(timeInput) {
  if (!timeInput) return '';
  
  if (typeof timeInput === 'string' && (timeInput.includes('ago') || timeInput.includes('Just now'))) {
    return timeInput;
  }

  const past = new Date(timeInput);
  if (isNaN(past.getTime())) return timeInput || '';

  const now = new Date();
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 30) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Notifications({ 
  onBack, 
  notifications = [], 
  firstLetter = 'M',
  onDeleteNotification,
  onMarkAllAsRead,
  onMarkAsRead
}) {
  const hasUnread = notifications.some(n => n.read === false || n.isRead === false);

  return (
    <div 
      className="w-full max-w-[95%] mx-auto flex flex-col text-[#111111] px-2 lg:px-4 pt-6 text-left animate-fadeIn"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      
      {/* HEADER ROW */}
      <div className="w-full flex items-center justify-between pb-4 mb-2 select-none relative">
        <button 
          type="button"
          onClick={onBack}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200/60 flex items-center justify-center text-gray-600 hover:text-marix-teal transition-all focus:outline-none cursor-pointer shadow-sm z-10"
        >
          <i className="ph ph-arrow-left text-xl font-bold"></i>
        </button>
        
        <h2 className="text-sm font-black uppercase tracking-wider text-[#111111] absolute left-1/2 -translate-x-1/2">
          Notifications
        </h2>
        
        <div className="w-10 h-10 md:w-11 md:h-11 opacity-0 pointer-events-none"></div>
      </div>
      
      {/* CENTERED CONTENT WRAPPER */}
      <div className="w-full max-w-2xl mx-auto mt-2 pb-12">
        <div className="bg-white border border-gray-200/70 p-3.5 sm:p-5 rounded-2xl shadow-sm flex flex-col transition-all">
          {notifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center text-center p-8 select-none my-6">
              <div className="w-16 h-16 rounded-full bg-marix-cream/50 border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                <i className="ph ph-bell-slash text-2xl text-marix-teal"></i>
              </div>
              <h3 className="text-sm font-black text-[#111111] tracking-tight">All caught up!</h3>
              <p className="text-xs font-medium text-gray-400 max-w-[240px] mt-1 leading-relaxed">
                You don't have any notifications right now.
              </p>
            </div>
          ) : (
            /* DYNAMIC NOTIFICATIONS LIST */
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between px-1 select-none pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-wider uppercase text-gray-400">Activity Log</span>
                  <span className="text-[10px] font-bold text-marix-teal bg-marix-teal/10 px-2 py-0.5 rounded-full">
                    {notifications.length} Total
                  </span>
                </div>

                {hasUnread && onMarkAllAsRead && (
                  <button 
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="text-[10px] font-bold text-marix-teal hover:underline focus:outline-none cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              {notifications.map(notif => {
                const formattedTime = formatTimeAgo(notif.createdAt || notif.time);
                const isUnread = notif.read === false || notif.isRead === false;

                return (
                  <div 
                    key={notif.id} 
                    onClick={() => {
                      if (isUnread && onMarkAsRead) {
                        onMarkAsRead(notif.id);
                      }
                    }}
                    className={`w-full p-3 sm:p-4 rounded-xl flex items-start gap-3 relative transition-all border cursor-pointer group ${
                      isUnread 
                        ? 'bg-marix-teal/5 border-marix-teal/20' 
                        : 'bg-marix-cream/30 border-gray-100 hover:border-gray-200/80'
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-marix-teal/10 text-marix-teal font-black flex items-center justify-center text-xs sm:text-sm select-none shrink-0 mt-0.5">
                      {firstLetter}
                    </div>

                    <div className="flex flex-col gap-1 flex-1 min-w-0 text-left">
                      <div className="flex items-baseline justify-between gap-2 w-full">
                        <h4 className="text-xs font-black text-[#111111] truncate max-w-[170px] sm:max-w-xs">
                          {notif.title}
                        </h4>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">
                            {formattedTime}
                          </span>
                          
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-marix-teal shrink-0 animate-pulse"></span>
                          )}

                          {/* DELETE NOTIFICATION ICON */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDeleteNotification) {
                                onDeleteNotification(notif.id);
                              }
                            }}
                            className="ml-1 text-gray-300 hover:text-red-500 focus:outline-none cursor-pointer transition-colors p-0.5"
                            title="Delete notification"
                          >
                            <i className="ph ph-x text-xs font-bold"></i>
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-medium break-words pr-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}