import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ChatAttachmentTileProps {
  name: string;
  /** Image preview URL — when omitted, shows the icon slot instead */
  previewUrl?: string;
  /** Fallback content when there's no image preview (an icon, extension badge, etc.) */
  icon?: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

/** A small file/image attachment tile, as shown in the composer's staged-files row. */
function ChatAttachmentTile({ name, previewUrl, icon, onRemove, className }: ChatAttachmentTileProps) {
  return (
    <div className="relative group">
      <div
        className={cn(
          'flex flex-col w-[120px] rounded-2xl border border-border/50 overflow-hidden',
          'bg-card hover:bg-muted/30 hover:border-border transition-colors duration-150 select-none',
          className,
        )}
      >
        <div className="h-[80px] relative flex items-center justify-center overflow-hidden bg-muted/20">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          ) : (
            icon
          )}
        </div>
        <div className="px-2 py-1.5 text-xs text-muted-foreground truncate font-mono">{name}</div>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

export { ChatAttachmentTile };
