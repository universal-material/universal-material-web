import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface EmailRow {
  sender: string;
  date: string;
  subject: string;
  preview: string;
  av: string;
  bg: string;
  unread: boolean;
  addr: string;
  content: string;
}

@Component({
  selector: 'docs-scaffold-list-detail-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scaffold-list-detail.component.html',
  styleUrl: './scaffold-list-detail.component.scss',
})
export class ScaffoldListDetailScreenComponent implements AfterViewInit, OnDestroy {
  selected: EmailRow | null = null;

  readonly emails: EmailRow[] = [
    {
      sender: 'Airbnb', date: '11:42 AM', subject: 'Your reservation in Lisbon is confirmed',
      preview: 'Booking #HMXJ72A1 — check-in starts on June 14...',
      av: 'Ai', bg: '#ff5a5f', unread: false, addr: 'automated@airbnb.com',
      content: `<p>Your trip is booked.</p><p>You're staying at <strong>Casa Azulejo — Alfama loft with river view</strong> from Sunday, June 14 to Saturday, June 20. The host, Mariana, will message you closer to your arrival with the entry code and Wi-Fi details.</p><p>Reservation code: <strong>HMXJ72A1</strong>. Total paid: €912 across two installments. Free cancellation until June 7, 23:59 local time.</p><p>Public transit from Humberto Delgado airport takes about 25 minutes by red-line metro. The host's place is a 4-minute walk from Santa Apolónia station.</p>`,
    },
    {
      sender: 'The New York Times', date: '7:30 AM', subject: 'Your morning briefing for Monday',
      preview: 'A flood of new climate data, a quiet milestone in space, and...',
      av: 'NY', bg: '#000000', unread: false, addr: 'nytdirect@nytimes.com',
      content: `<p>Good morning. Here's what you need to know to start your week.</p><p><strong>Climate.</strong> A coalition of 28 research institutions released the largest open dataset of ocean-temperature readings ever published, covering 80 years of measurements at four-meter depth resolution.</p><p><strong>Space.</strong> The privately funded Helios-3 sample-return probe entered lunar orbit overnight without incident — the seventh successful arrival in 18 months.</p><p><strong>Markets.</strong> Futures are flat ahead of Wednesday's inflation print. Tokyo and Hong Kong closed mixed.</p>`,
    },
    {
      sender: 'Slack', date: '6:14 AM', subject: 'Maya mentioned you in #design-review',
      preview: '"@you can you take a look at the rail icon spacing before we ship?"',
      av: 'Sl', bg: '#4a154b', unread: true, addr: 'notifications@slack.com',
      content: `<p>Maya Chen mentioned you in <strong>#design-review</strong> at 6:14 AM.</p><p style="border-left: 3px solid var(--u-color-outline); padding-left: 12px; margin-left: 0; font-style: italic;">@you can you take a look at the rail icon spacing before we ship? The 12dp on the collapsed state looks tighter than the spec — I cropped the comparison into the thread.</p><p>Open Slack to reply, or jump straight to the thread from the link below.</p>`,
    },
    {
      sender: 'Duolingo', date: 'May 24', subject: "Don't break your 47-day streak",
      preview: 'You still have 4 hours to keep your streak alive...',
      av: 'Du', bg: '#58cc02', unread: false, addr: 'hello@duolingo.com',
      content: `<p>You're 4 hours away from losing your <strong>47-day streak</strong>.</p><p>Five minutes of Italian is all it takes. Today's lesson is a quick review of irregular past participles — nothing new, just a refresher.</p>`,
    },
    {
      sender: 'Patagonia', date: 'May 23', subject: 'Your order has shipped',
      preview: 'Order #84920113 — tracking number inside...',
      av: 'Pa', bg: '#232f3e', unread: false, addr: 'orders@patagonia.com',
      content: `<p>Good news — your order is on the way.</p><p><strong>Order #84920113</strong>: Nano Puff jacket (slate blue, M) and a pair of Capilene Cool Daily crew socks. Carrier: UPS Ground. Expected delivery between Wednesday, May 27 and Friday, May 29.</p><p>Tracking number 1Z 882 4Y9 03 9421 0832. Updates land in your account the moment UPS scans the parcel.</p>`,
    },
    {
      sender: 'Proton', date: 'May 22', subject: 'New sign-in from Berlin, Germany',
      preview: 'A new device just signed into your Proton account...',
      av: 'Pr', bg: '#6d4aff', unread: true, addr: 'no-reply@protonmail.com',
      content: `<p>We noticed a new sign-in to your Proton account.</p><p><strong>Where:</strong> Berlin, Germany<br><strong>When:</strong> May 22, 2026 at 21:08 CEST<br><strong>Device:</strong> Firefox 128 on Fedora 41</p><p>If this was you, you can ignore this message. If it wasn't, change your password and revoke active sessions from your security settings immediately.</p>`,
    },
    {
      sender: 'Coursera', date: 'May 21', subject: 'Certificate ready: Deep Learning Specialization',
      preview: 'Congratulations — your verified certificate is available...',
      av: 'Co', bg: '#0056d2', unread: false, addr: 'no-reply@t.mail.coursera.org',
      content: `<p>Congratulations — you completed the <strong>Deep Learning Specialization</strong>.</p><p>Your verified certificate is ready to download as a PDF and is now visible on your public learner profile. Add the credential to LinkedIn with one click from the dashboard.</p><p>Final grade: 96%. You finished 14 days ahead of the cohort median.</p>`,
    },
    {
      sender: 'Strava', date: 'May 20', subject: 'Your weekly activity summary',
      preview: 'You logged 38.4 km across 5 activities this week...',
      av: 'St', bg: '#fc4c02', unread: false, addr: 'no-reply@strava.com',
      content: `<p>Here's how last week stacked up.</p><p><strong>5 activities</strong> · 38.4 km total · 4 h 27 min moving time · 612 m of elevation gain.</p><p>Your longest run was an easy 12 km loop on Saturday morning at a 5:14/km pace. Your shortest was a 3 km lunchtime shake-out on Thursday.</p>`,
    },
    {
      sender: 'Dropbox', date: 'May 19', subject: "You've used 92% of your storage",
      preview: 'You have 16 GB free of 200 GB. Time to clean up or upgrade...',
      av: 'Db', bg: '#0061ff', unread: false, addr: 'no-reply@dropbox.com',
      content: `<p>Your Dropbox is filling up.</p><p>You have <strong>16 GB free out of 200 GB</strong>. New file uploads will start to fail once you reach 100% — and your camera-uploads folder is pacing to fill the remaining space in about 11 days.</p><p>Two options: review what's eating the most space from the Storage page, or bump up to the 2 TB plan for the price you're already paying through July.</p>`,
    },
    {
      sender: '1Password', date: 'May 18', subject: 'Your vault export is ready',
      preview: 'The export you requested is available for the next 24 hours...',
      av: '1P', bg: '#0572ec', unread: false, addr: 'no-reply@1password.com',
      content: `<p>The encrypted vault export you requested on May 18 is ready.</p><p>The archive is <strong>282 MB</strong> and will be available to download for the next 24 hours, after which it is permanently deleted from our servers. You'll need your Secret Key and account password to decrypt it locally.</p>`,
    },
    {
      sender: 'AWS Billing', date: 'May 17', subject: 'Budget alert: 80% of monthly threshold reached',
      preview: 'Your account has spent $384.21 of the $480 budget for May...',
      av: 'AW', bg: '#ff9900', unread: true, addr: 'no-reply-aws@amazon.com',
      content: `<p>Your "May 2026 production" budget has crossed the <strong>80% threshold</strong>.</p><p>Spent so far: <strong>$384.21</strong> of $480. At the current pace the budget will be exceeded around May 28. The largest contributors this month are CloudFront egress ($142) and RDS db.r6g.large instance-hours ($118).</p>`,
    },
    {
      sender: 'Reddit', date: 'May 16', subject: 'u/syntax_garden replied to your comment',
      preview: 'In r/webdev: "Yeah I ran into the exact same thing — the trick is..."',
      av: 'Rd', bg: '#ff4500', unread: false, addr: 'noreply@redditmail.com',
      content: `<p><strong>u/syntax_garden</strong> replied to your comment in <strong>r/webdev</strong>.</p><p style="border-left: 3px solid var(--u-color-outline); padding-left: 12px; margin-left: 0; font-style: italic;">Yeah I ran into the exact same thing — the trick is to set fetchpriority="high" on the LCP image and skip the preload tag entirely. Chrome was double-fetching for me too.</p>`,
    },
    {
      sender: 'Booking.com', date: 'May 15', subject: 'Your trip to Kyoto starts tomorrow',
      preview: 'Check-in is from 3:00 PM at Ryokan Suzune...',
      av: 'Bk', bg: '#003580', unread: false, addr: 'no-reply@booking.com',
      content: `<p>Your trip starts tomorrow. Here are the final details.</p><p><strong>Ryokan Suzune</strong>, 14 Higashiyama-ku, Kyoto. Check-in 3:00 PM – 8:00 PM. Dinner is included on your first and third nights, served kaiseki-style in the room between 6:30 PM and 7:30 PM.</p><p>The ryokan does not have a 24-hour reception. If you arrive after 8:00 PM, call ahead at +81 75 555 0314 so the night attendant can let you in.</p>`,
    },
    {
      sender: 'Goodreads', date: 'May 14', subject: '3 friends finished a book this week',
      preview: 'Sam, Priya and Jordan all marked books as read recently...',
      av: 'Gr', bg: '#553b08', unread: false, addr: 'noreply@goodreads.com',
      content: `<p>Three people you follow finished a book this week.</p><p><strong>Sam</strong> rated <em>The Anatomy of Patience</em> 5 stars. <strong>Priya</strong> finished <em>Cartography of Forgotten Roads</em> and wrote a short review. <strong>Jordan</strong> abandoned <em>Vellichor</em> at the 60% mark with a one-line note: "couldn't make myself care."</p>`,
    },
    {
      sender: 'Twitch', date: 'May 13', subject: 'pixel_oracle is live: just chatting',
      preview: 'A channel you follow just started streaming...',
      av: 'Tw', bg: '#9146ff', unread: false, addr: 'no-reply@twitch.tv',
      content: `<p><strong>pixel_oracle</strong> went live 4 minutes ago.</p><p>Stream title: "Q&A before tomorrow's tournament — drop your questions". Tagged <em>Just Chatting</em>. 1,284 viewers and climbing.</p>`,
    },
    {
      sender: 'Pinterest', date: 'May 12', subject: '10 new pins from boards you follow',
      preview: 'Fresh ideas in Mid-century interiors, Hand-lettering, and more...',
      av: 'Pi', bg: '#e60023', unread: false, addr: 'updates@pinterest.com',
      content: `<p>New pins from boards you follow this week.</p><p><strong>Mid-century interiors</strong> got 4 new pins. <strong>Hand-lettering inspiration</strong> got 3, and <strong>Cabin floor plans</strong> got 3. Tap any board to browse the full update.</p>`,
    },
    {
      sender: 'Apple', date: 'May 11', subject: 'Your receipt from the App Store',
      preview: 'Receipt #482719304 — Procreate, $12.99...',
      av: 'Ap', bg: '#1d1d1f', unread: false, addr: 'no_reply@email.apple.com',
      content: `<p>This is a receipt for your recent purchase. No action is needed.</p><p><strong>Procreate</strong> — illustration app — $12.99. Purchased May 11, 2026 at 4:47 PM PT. Billed to Visa ending in 4421.</p><p>If you did not authorize this purchase, you can request a refund from <em>reportaproblem.apple.com</em> within 90 days.</p>`,
    },
    {
      sender: 'Adobe', date: 'May 10', subject: 'Your subscription renews in 3 days',
      preview: 'Creative Cloud All Apps · $54.99 / month...',
      av: 'Ad', bg: '#fa0f00', unread: false, addr: 'mail@mail.adobe.com',
      content: `<p>Your <strong>Creative Cloud All Apps</strong> subscription will automatically renew on May 13, 2026 for $54.99.</p><p>The charge will go to the Mastercard ending in 8830. To pause, switch plans, or cancel before the renewal, manage your subscription from your Adobe account page.</p>`,
    },
  ];

  #scrollListeners: Array<{ el: HTMLElement; handler: EventListener }> = [];

  constructor(readonly host: ElementRef<HTMLElement>) {}

  selectEmail(row: EmailRow): void {
    this.selected = row;
    row.unread = false;
    const detail = document.getElementById('screen-detail') as
      (HTMLElement & { show?: () => void }) | null;
    detail?.show?.();
  }

  closeDetail(): void {
    const detail = document.getElementById('screen-detail') as
      (HTMLElement & { close?: () => void }) | null;
    detail?.close?.();
  }

  ngAfterViewInit(): void {
    // Replicate the mockup's self-hiding thin scrollbar: add `.scrolling`
    // while the user is scrolling; remove it 700ms after the last scroll
    // event. The CSS in the SCSS keys off this class.
    const els = this.host.nativeElement.querySelectorAll<HTMLElement>('.scrollable');

    els.forEach((el) => {
      let timer: number | null = null;
      const handler = (): void => {
        el.classList.add('scrolling');

        if (timer !== null) {
          window.clearTimeout(timer);
        }

        timer = window.setTimeout(() => {
          el.classList.remove('scrolling');
          timer = null;
        }, 700);
      };

      el.addEventListener('scroll', handler, { passive: true });
      this.#scrollListeners.push({ el, handler });
    });
  }

  ngOnDestroy(): void {
    for (const { el, handler } of this.#scrollListeners) {
      el.removeEventListener('scroll', handler);
    }

    this.#scrollListeners = [];
  }
}
