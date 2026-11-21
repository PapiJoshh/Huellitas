import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt, matplotlib.dates as md
from datetime import date
T=[("1. Inicio","#0B6BDE",[("Planteamiento del problema y justificación","2026-09-07","2026-09-18"),("Objetivos y alcance","2026-09-14","2026-09-25")]),
("2. Definición","#7C3AED",[("Matriz de responsabilidades","2026-09-21","2026-09-30"),("Levantamiento de requerimientos","2026-09-28","2026-10-09"),("Casos de uso","2026-10-05","2026-10-16")]),
("3. Diseño","#0E9F6E",[("Carta de navegación","2026-10-05","2026-10-12"),("Selección de framework","2026-10-12","2026-10-16"),("Wireframes","2026-10-12","2026-10-23"),("Maquetas y prototipo de interfaz","2026-10-19","2026-11-06")]),
("4. Construcción","#D97706",[("Frontend (React + Tailwind)","2026-10-19","2026-11-13"),("Backend y pagos (Express, Stripe, Supabase)","2026-10-26","2026-11-10"),("Despliegue (GitHub Pages y Render)","2026-11-09","2026-11-13")]),
("5. Cierre","#DC2626",[("Pruebas funcionales","2026-11-09","2026-11-17"),("Integración documental y repositorio","2026-11-16","2026-11-21")])]
d=lambda s:date.fromisoformat(s)
fig,ax=plt.subplots(figsize=(11,6.6),dpi=170)
y=0; ticks=[];labs=[]
for sec,c,rows in T:
    for n,s,e in rows:
        ax.barh(y,(d(e)-d(s)).days+1,left=md.date2num(d(s)),color=c,height=0.62)
        ticks.append(y);labs.append(n);y+=1
    y+=0.35
ax.scatter([md.date2num(d("2026-11-22"))+0.5],[y-0.35+0.0],marker='D',s=90,color='#111',zorder=5)
ticks.append(y-0.35);labs.append("Entrega en buzón (22 nov)")
ax.set_yticks(ticks);ax.set_yticklabels(labs,fontsize=9.5);ax.invert_yaxis()
ax.xaxis_date();ax.xaxis.set_major_locator(md.WeekdayLocator(byweekday=md.MO,interval=2));ax.xaxis.set_major_formatter(md.DateFormatter('%d %b'))
ax.tick_params(axis='x',labelsize=9);ax.grid(axis='x',color='#ddd');ax.set_axisbelow(True)
ax.set_xlim(md.date2num(d("2026-09-05")),md.date2num(d("2026-11-25")))
for sp in ('top','right','left'): ax.spines[sp].set_visible(False)
ax.tick_params(axis='y',length=0)
import matplotlib.patches as mp
ax.legend(handles=[mp.Patch(color=c,label=s) for s,c,_ in T],loc='lower left',fontsize=8.5,ncol=5,frameon=False,bbox_to_anchor=(0,-0.16))
ax.set_title("Diagrama de Gantt – Huellitas (septiembre – noviembre 2026)",fontsize=12,fontweight='bold',loc='left')
plt.tight_layout();plt.savefig('gantt.png',facecolor='white');print('ok')
