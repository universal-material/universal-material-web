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
      sender: 'Figma', date: '03:06', subject: "We've updated our Terms of Service",
      preview: "We're reaching out to let you know we're updating Figma's terms...",
      av: 'Fi', bg: '#1a237e', unread: true, addr: 'noreply@figma.com',
      content: `<p>Olá Hideyuki,</p><p>Estamos entrando em contato para informar que <strong>atualizamos nossos Termos de Serviço</strong> e Política de Privacidade. Essas mudanças entrarão em vigor em 1º de julho de 2025.</p><p>As principais atualizações incluem maior clareza sobre como usamos seus dados de design, novas disposições sobre colaboração em equipe e direitos de exportação de arquivos.</p><p><strong>O que mudou na prática:</strong></p><p>Primeiro, detalhamos como os dados de arquivos compartilhados são processados quando você convida colaboradores externos. Segundo, esclarecemos a propriedade intelectual de componentes publicados em bibliotecas de equipe. Terceiro, adicionamos uma seção sobre retenção de dados após o encerramento de uma conta.</p><p>Também revisamos a linguagem sobre uso de recursos de IA dentro do produto. Quando você utiliza funcionalidades assistidas por IA, o conteúdo gerado segue as mesmas regras de propriedade dos demais arquivos da sua organização.</p><p>Nenhuma ação é necessária da sua parte. Ao continuar usando o Figma após 1º de julho de 2025, você concorda automaticamente com os novos termos. Caso não concorde, você pode encerrar sua conta a qualquer momento nas configurações.</p><p>Se tiver dúvidas sobre qualquer uma dessas mudanças, nossa equipe de suporte está disponível para ajudar. Recomendamos a leitura completa do documento atualizado, disponível no link abaixo.</p><p>Agradecemos por fazer parte da comunidade Figma.</p><p>Atenciosamente,<br>Equipe Figma</p>`,
    },
    {
      sender: 'Discord', date: '02:06', subject: 'Pagamento do Discord Malsucedido',
      preview: 'Falha na Cobrança de Assinatura — Olá, erichideyuki...',
      av: 'Di', bg: '#5865f2', unread: true, addr: 'noreply@discord.com',
      content: `<p>Olá Hideyuki,</p><p>Sua assinatura <strong>Discord Nitro</strong> não pôde ser renovada pois houve uma falha na cobrança do método de pagamento cadastrado.</p><p>Por favor, verifique se o cartão está válido e com limite disponível.</p>`,
    },
    {
      sender: 'Discord', date: '22 mai', subject: 'Pagamento do Discord Malsucedido',
      preview: 'Segundo aviso sobre a falha no pagamento da sua assinatura...',
      av: 'Di', bg: '#5865f2', unread: false, addr: 'noreply@discord.com',
      content: `<p>Hideyuki,</p><p>Este é um <strong>segundo aviso</strong> sobre a falha no pagamento da sua assinatura Discord Nitro.</p>`,
    },
    {
      sender: 'Spotify', date: '21 mai', subject: 'Xande de Pilares e Jo... — Atualizações',
      preview: 'Novidades dos artistas que você segue esta semana',
      av: 'Sp', bg: '#1db954', unread: false, addr: 'no-reply@spotify.com',
      content: `<p>Esta semana nos artistas que você segue:</p><p><strong>Xande de Pilares</strong> lançou um novo álbum ao vivo. <strong>João Bosco</strong> tem show marcado em São Paulo.</p>`,
    },
    {
      sender: 'Notion', date: '20 mai', subject: 'Your weekly digest is ready',
      preview: "Here's what your team has been working on this week...",
      av: 'No', bg: '#2f2f2f', unread: false, addr: 'notify@notion.so',
      content: `<p>Here's what your team has been working on this week.</p><p><strong>12 new pages</strong> were created, <strong>34 pages</strong> were updated.</p>`,
    },
    {
      sender: 'GitHub', date: '19 mai', subject: '[dependabot] Bump lodash 4.17.20 → 4.17.21',
      preview: 'Bumps lodash. This update includes a security patch...',
      av: 'Gh', bg: '#24292e', unread: false, addr: 'noreply@github.com',
      content: `<p>Bumps <strong>lodash</strong> from 4.17.20 to 4.17.21.</p><p>This update includes a patch for prototype pollution vulnerability CVE-2021-23337.</p>`,
    },
    {
      sender: 'Kuara', date: '18 mai', subject: 'Relatório bimestral disponível',
      preview: 'O boletim do 2º bimestre já está pronto para download',
      av: 'Ku', bg: '#C44530', unread: false, addr: 'no-reply@kuarahub.com',
      content: `<p>O <strong>relatório bimestral</strong> da turma 9º ano A já está disponível na plataforma.</p><p>Acesse o painel para visualizar médias, frequência e anotações pedagógicas consolidadas. O documento reúne o desempenho individual de cada aluno, gráficos de evolução comparativa e o registro de ocorrências do período.</p><p>Caso identifique alguma divergência nos lançamentos, o prazo para solicitar revisão é de cinco dias úteis a contar desta notificação.</p><p>Atenciosamente,<br>Equipe Pedagógica Kuara</p>`,
    },
    {
      sender: 'LinkedIn', date: '17 mai', subject: 'Você apareceu em 14 buscas esta semana',
      preview: 'Veja quem está procurando profissionais como você...',
      av: 'Li', bg: '#0a66c2', unread: true, addr: 'notifications@linkedin.com',
      content: `<p>Olá Hideyuki,</p><p>Seu perfil apareceu em <strong>14 buscas</strong> de recrutadores nesta semana. Profissionais com seu conjunto de habilidades estão em alta demanda.</p><p>Atualize suas competências para aumentar sua visibilidade.</p>`,
    },
    {
      sender: 'Azure DevOps', date: '16 mai', subject: 'Pipeline #4821 concluído com sucesso',
      preview: 'Build e deploy do ambiente de staging finalizados...',
      av: 'Az', bg: '#0078d4', unread: false, addr: 'azuredevops@microsoft.com',
      content: `<p>O pipeline <strong>#4821</strong> da branch <code>main</code> foi concluído com sucesso.</p><p>Etapas: build, testes unitários (.NET), lint do Angular e publicação no ambiente de staging — todas aprovadas. Duração total: 6 min 12 s.</p>`,
    },
    {
      sender: 'Cloudflare', date: '15 mai', subject: 'Resumo semanal de tráfego — kuarahub.com',
      preview: 'Seu site recebeu 48,2 mil requisições esta semana...',
      av: 'Cf', bg: '#f38020', unread: false, addr: 'noreply@cloudflare.com',
      content: `<p>Resumo de tráfego do domínio <strong>kuarahub.com</strong>:</p><p>48,2 mil requisições, 99,98% de uptime, 0 ameaças bloqueadas. O cache atendeu 71% das requisições no edge.</p>`,
    },
    {
      sender: 'npm', date: '14 mai', subject: 'Pacote @universal-material/web publicado',
      preview: 'A versão 2.4.0 foi publicada com sucesso no registry...',
      av: 'np', bg: '#cb3837', unread: false, addr: 'support@npmjs.com',
      content: `<p>A versão <strong>2.4.0</strong> do pacote <code>@universal-material/web</code> foi publicada com sucesso no registry público.</p><p>O pacote já está disponível para instalação.</p>`,
    },
    {
      sender: 'Google Agenda', date: '13 mai', subject: 'Lembrete: Daily da equipe às 09:00',
      preview: 'Reunião diária de alinhamento começa em 30 minutos...',
      av: 'GA', bg: '#1a73e8', unread: false, addr: 'calendar-notification@google.com',
      content: `<p>Você tem um evento próximo:</p><p><strong>Daily da equipe</strong> — hoje às 09:00, sala virtual. Pauta: andamento das tarefas do sprint atual.</p>`,
    },
    {
      sender: 'Stack Overflow', date: '12 mai', subject: 'Sua resposta recebeu 5 votos positivos',
      preview: 'A resposta sobre Hono middleware foi bem avaliada...',
      av: 'So', bg: '#f48024', unread: false, addr: 'do-not-reply@stackoverflow.email',
      content: `<p>Boa notícia, Hideyuki.</p><p>Sua resposta sobre <strong>Hono middleware e Set-Cookie</strong> recebeu 5 votos positivos nas últimas 24 horas.</p>`,
    },
    {
      sender: 'Banco Inter', date: '11 mai', subject: 'Comprovante de pagamento disponível',
      preview: 'O comprovante da sua última transação está pronto...',
      av: 'Bi', bg: '#ff7a00', unread: false, addr: 'contato@bancointer.com.br',
      content: `<p>Seu pagamento foi processado com sucesso.</p><p>O comprovante já está disponível para download no aplicativo.</p>`,
    },
    {
      sender: 'YouTube', date: '10 mai', subject: 'Novidades dos canais que você assina',
      preview: '3 novos vídeos de canais sobre desenvolvimento web...',
      av: 'Yt', bg: '#ff0000', unread: false, addr: 'noreply@youtube.com',
      content: `<p>Os canais que você assina publicaram novos vídeos esta semana.</p><p>Confira as recomendações na sua aba de inscrições.</p>`,
    },
    {
      sender: 'Figma', date: '08 mai', subject: 'Comentário novo no arquivo Kuara — Design System',
      preview: 'Alguém mencionou você em um comentário...',
      av: 'Fi', bg: '#1a237e', unread: false, addr: 'noreply@figma.com',
      content: `<p>Você foi mencionado em um comentário no arquivo <strong>Kuara — Design System</strong>.</p><p>Abra o Figma para visualizar e responder.</p>`,
    },
    {
      sender: 'Vercel', date: '07 mai', subject: 'Deploy de produção concluído',
      preview: 'O deploy mais recente está disponível em produção...',
      av: 'Ve', bg: '#000000', unread: false, addr: 'notifications@vercel.com',
      content: `<p>O deploy de produção foi concluído com sucesso.</p><p>As alterações já estão no ar.</p>`,
    },
    {
      sender: 'Spotify', date: '05 mai', subject: 'Sua retrospectiva mensal chegou',
      preview: 'Veja os artistas e músicas que marcaram seu mês...',
      av: 'Sp', bg: '#1db954', unread: false, addr: 'no-reply@spotify.com',
      content: `<p>Sua retrospectiva de abril está pronta.</p><p>Veja os artistas, músicas e gêneros que marcaram o seu mês.</p>`,
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
