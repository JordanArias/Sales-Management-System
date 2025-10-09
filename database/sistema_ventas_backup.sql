--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8
-- Dumped by pg_dump version 14.8

-- Started on 2025-10-08 23:03:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16446)
-- Name: caja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.caja (
    cod_caja integer NOT NULL,
    fecha character varying(10),
    hr_apertura character varying(10),
    hr_cierre character varying(10),
    saldoini_bs integer,
    saldofin_bs integer,
    saldoini_arg integer,
    saldofin_arg integer,
    cant_items integer,
    estado integer
);


ALTER TABLE public.caja OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16445)
-- Name: caja_cod_caja_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.caja_cod_caja_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.caja_cod_caja_seq OWNER TO postgres;

--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 214
-- Name: caja_cod_caja_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.caja_cod_caja_seq OWNED BY public.caja.cod_caja;


--
-- TOC entry 217 (class 1259 OID 16453)
-- Name: categoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria (
    cod_categoria integer NOT NULL,
    nom_categoria character varying(15) NOT NULL
);


ALTER TABLE public.categoria OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16452)
-- Name: categoria_cod_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_cod_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categoria_cod_categoria_seq OWNER TO postgres;

--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 216
-- Name: categoria_cod_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_cod_categoria_seq OWNED BY public.categoria.cod_categoria;


--
-- TOC entry 225 (class 1259 OID 24577)
-- Name: detalle_venta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_venta (
    cod_item integer NOT NULL,
    cod_venta integer,
    cod_producto integer,
    unidad_item integer,
    descript_item character varying(50),
    item_llevar boolean
);


ALTER TABLE public.detalle_venta OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24576)
-- Name: detalle_venta_cod_item_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_venta_cod_item_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.detalle_venta_cod_item_seq OWNER TO postgres;

--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 224
-- Name: detalle_venta_cod_item_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_venta_cod_item_seq OWNED BY public.detalle_venta.cod_item;


--
-- TOC entry 226 (class 1259 OID 24606)
-- Name: item_presa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_presa (
    cod_item integer,
    cod_presa integer,
    unidad_presa integer,
    descrip_presa character varying(50)
);


ALTER TABLE public.item_presa OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16472)
-- Name: presa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.presa (
    cod_presa integer NOT NULL,
    nom_presa character varying(10) NOT NULL
);


ALTER TABLE public.presa OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16471)
-- Name: presa_cod_presa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.presa_cod_presa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.presa_cod_presa_seq OWNER TO postgres;

--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 220
-- Name: presa_cod_presa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.presa_cod_presa_seq OWNED BY public.presa.cod_presa;


--
-- TOC entry 219 (class 1259 OID 16460)
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    cod_producto integer NOT NULL,
    cod_categoria integer NOT NULL,
    nom_pro character varying(60) NOT NULL,
    descrip_pro character varying(100),
    precio_bs integer,
    precio_arg integer,
    opciones character varying[]
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16459)
-- Name: producto_cod_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_cod_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.producto_cod_producto_seq OWNER TO postgres;

--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 218
-- Name: producto_cod_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_cod_producto_seq OWNED BY public.producto.cod_producto;


--
-- TOC entry 212 (class 1259 OID 16426)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    cod_rol integer NOT NULL,
    rol character varying(30),
    enlace character varying(30)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16425)
-- Name: roles_cod_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_cod_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_cod_rol_seq OWNER TO postgres;

--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 211
-- Name: roles_cod_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_cod_rol_seq OWNED BY public.roles.cod_rol;


--
-- TOC entry 213 (class 1259 OID 16432)
-- Name: roles_usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_usuarios (
    ci_usuario integer NOT NULL,
    cod_rol integer NOT NULL
);


ALTER TABLE public.roles_usuarios OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16419)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    ci_usuario integer NOT NULL,
    nom_usu character varying(15) NOT NULL,
    ap_usu character varying(15),
    clave character varying(100)
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16418)
-- Name: usuario_ci_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_ci_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuario_ci_usuario_seq OWNER TO postgres;

--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 209
-- Name: usuario_ci_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_ci_usuario_seq OWNED BY public.usuario.ci_usuario;


--
-- TOC entry 223 (class 1259 OID 16479)
-- Name: venta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venta (
    cod_venta integer NOT NULL,
    cod_caja integer,
    factura character varying(10),
    mesa integer,
    total_bs integer,
    pagado_bs integer,
    cambio_bs integer,
    total_arg integer,
    pag_arg integer,
    cambio_arg integer,
    hora character varying(10),
    estado integer,
    descrip_venta character varying(50),
    vent_llevar boolean,
    estado_l integer,
    ticket integer
);


ALTER TABLE public.venta OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16478)
-- Name: venta_cod_venta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venta_cod_venta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venta_cod_venta_seq OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 222
-- Name: venta_cod_venta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venta_cod_venta_seq OWNED BY public.venta.cod_venta;


--
-- TOC entry 3209 (class 2604 OID 16449)
-- Name: caja cod_caja; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caja ALTER COLUMN cod_caja SET DEFAULT nextval('public.caja_cod_caja_seq'::regclass);


--
-- TOC entry 3210 (class 2604 OID 16456)
-- Name: categoria cod_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria ALTER COLUMN cod_categoria SET DEFAULT nextval('public.categoria_cod_categoria_seq'::regclass);


--
-- TOC entry 3214 (class 2604 OID 24580)
-- Name: detalle_venta cod_item; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta ALTER COLUMN cod_item SET DEFAULT nextval('public.detalle_venta_cod_item_seq'::regclass);


--
-- TOC entry 3212 (class 2604 OID 16475)
-- Name: presa cod_presa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presa ALTER COLUMN cod_presa SET DEFAULT nextval('public.presa_cod_presa_seq'::regclass);


--
-- TOC entry 3211 (class 2604 OID 16463)
-- Name: producto cod_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN cod_producto SET DEFAULT nextval('public.producto_cod_producto_seq'::regclass);


--
-- TOC entry 3208 (class 2604 OID 16429)
-- Name: roles cod_rol; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN cod_rol SET DEFAULT nextval('public.roles_cod_rol_seq'::regclass);


--
-- TOC entry 3207 (class 2604 OID 16422)
-- Name: usuario ci_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN ci_usuario SET DEFAULT nextval('public.usuario_ci_usuario_seq'::regclass);


--
-- TOC entry 3213 (class 2604 OID 16482)
-- Name: venta cod_venta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta ALTER COLUMN cod_venta SET DEFAULT nextval('public.venta_cod_venta_seq'::regclass);


--
-- TOC entry 3386 (class 0 OID 16446)
-- Dependencies: 215
-- Data for Name: caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.caja (cod_caja, fecha, hr_apertura, hr_cierre, saldoini_bs, saldofin_bs, saldoini_arg, saldofin_arg, cant_items, estado) FROM stdin;
1	01/1/2024	8:25	9:41	200	2192	2000	144700	42	1
2	03/1/2024	9:42	21:10	100	4171	2500	140800	50	1
3	05/1/2024	12:30	22:10	200	1766	2000	79600	28	1
4	10/2/2024	7:30	22:13	200	473	2000	23500	7	1
5	15/2/2024	7:30	22:14	200	355	2000	19000	4	1
6	1/3/2024	7:30	22:15	200	605	2000	15500	4	1
7	5/3/2024	7:30	22:17	200	530	2000	2000	5	1
8	5/4/2024	7:30	7:16	200	433	2000	28000	8	1
9	8/4/2024	7:30	7:17	200	4341	2000	99370	60	1
10	9/4/2024	08:24	8:24	100	100	10000	10000	0	1
11	9/4/2024	08:25	8:49	0	150	0	0	2	1
12	9/4/2024	08:53	8:55	10	110	10	10	1	1
13	9/4/2024	09:02	11:28	100	185	1000	1000	3	1
14	5/8/2024	11:51	11:14	0	10	0	1000	1	1
15	19/9/2025	11:15	15:3	200	260	1000	6000	2	1
16	25/9/2025	15:04	15:10	100	636	2000	3000	5	1
17	25/9/2025	15:11	15:25	300	611	2500	7400	8	1
18	25/9/2025	15:25	15:28	100	176	1000	12300	4	1
19	26/9/2025	10:47	15:1	100	170	1000	1000	6	1
20	30/9/2025	15:01		100	0	1000	0	0	0
\.


--
-- TOC entry 3388 (class 0 OID 16453)
-- Dependencies: 217
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria (cod_categoria, nom_categoria) FROM stdin;
1	pollo
2	bebidas
3	Guarniciones
4	Pizzas
\.


--
-- TOC entry 3396 (class 0 OID 24577)
-- Dependencies: 225
-- Data for Name: detalle_venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_venta (cod_item, cod_venta, cod_producto, unidad_item, descript_item, item_llevar) FROM stdin;
2	1	61	1		f
3	1	61	1	1 c/a 	t
4	1	72	1		f
6	2	62	1		f
7	2	61	1		f
8	2	74	1		f
10	3	61	3		f
161	53	64	1		f
162	53	61	1		t
16	5	61	2		f
18	6	63	1		f
19	6	76	1		f
163	53	81	1		f
165	54	61	2	1 c/a 	f
21	7	62	2	1 c/a 	f
22	7	65	1		f
24	8	64	1		f
26	9	62	4		f
28	10	64	1		f
29	10	80	1		f
34	12	61	1		f
35	12	62	1		f
37	13	61	1		f
39	14	62	2		f
40	14	75	1		f
42	15	61	3		f
48	17	62	2		f
49	17	69	1		f
51	18	62	1		f
52	18	61	3		f
54	19	63	2		f
55	19	80	2		f
57	20	61	1		f
58	20	62	1		f
59	20	76	1		f
61	21	61	5		f
62	21	79	1		f
44	16	64	2		f
45	16	76	3		f
12	4	61	1		f
13	4	62	2		f
31	11	62	2		f
32	11	61	2		t
64	22	62	1		f
65	22	61	2		f
67	23	61	2		f
68	23	65	2		f
70	24	62	3		f
72	25	63	1		f
74	26	64	1		f
76	27	62	1		f
78	28	62	2		f
79	28	70	1		f
81	29	64	1		f
82	29	64	1		f
84	30	62	1		f
85	30	61	2		f
87	31	61	1		f
88	31	62	1		t
90	32	64	1		f
91	32	85	1		f
92	32	86	1		f
93	32	81	1		f
95	33	62	6		f
96	33	83	1		f
97	33	76	1		f
99	34	62	2		f
100	34	61	1		f
101	34	86	1		f
102	34	74	1		f
104	35	61	3		f
105	35	62	2		f
107	36	62	1		f
108	36	61	1		f
110	37	62	3		f
111	37	62	1		t
113	38	62	3		f
114	38	61	2		f
116	39	62	3		f
117	39	72	1		f
119	40	62	1		f
120	40	61	3		f
122	41	62	3		f
123	41	61	1		t
125	42	61	4	2 c/a 	f
127	43	61	3		f
128	43	62	1		t
130	44	62	4		f
131	44	83	1		f
133	45	64	1		f
134	45	82	1		f
136	46	61	7		f
137	46	80	3		f
139	47	61	3		f
140	47	62	3		f
141	47	75	1		f
142	47	74	1		f
144	48	62	2		f
145	48	71	1		f
146	48	85	1		f
148	49	63	2		f
150	50	61	4		f
151	50	62	1		t
152	50	76	1		f
154	51	61	3	1 c/a 	f
156	52	62	2		f
157	52	61	1		f
158	52	61	1		t
159	52	79	1		f
166	54	62	3	2 c/a 	f
167	54	73	1		f
168	54	86	1		f
170	55	62	4	3 c/a 	f
171	55	61	2		f
173	56	62	2	1 c/a 	f
174	56	61	3	1 c/a 	f
175	56	82	1		f
176	56	85	1		f
178	57	61	3	1 c/a 	f
179	57	62	2		t
181	58	64	1		f
182	58	82	1		f
184	59	62	4	2 c/a 	f
185	59	83	1		f
186	59	73	1		f
188	60	62	2		f
189	60	61	3		f
190	60	62	1		t
191	60	80	1		f
193	61	61	4		f
195	62	64	2		f
197	63	62	3		f
198	63	61	1		f
200	64	62	3		f
201	64	70	1		f
203	65	61	4		f
204	65	76	1		f
206	66	63	1		f
208	67	62	3		f
210	68	61	5		f
211	68	62	1		f
213	69	61	2	1 c/a 	f
215	70	61	3	2 c/a 	f
217	71	61	1	1 c/a 	f
218	71	62	3		f
220	72	61	1		f
221	72	65	1		f
223	73	61	4	1 c/a 	f
225	74	63	1		f
226	74	64	1		f
227	74	81	1		f
228	74	82	1		f
230	75	62	6	3 c/a 	f
231	75	80	1		f
233	76	61	3	3 c/a 	f
235	77	64	1		f
236	77	84	1		f
237	77	81	1		f
241	79	62	3		f
242	79	61	2		f
239	78	62	4	1 c/a 	f
244	80	61	2		f
245	80	70	1	fría	f
250	82	61	11	4 c/a 	f
263	86	63	1		f
264	86	61	1		t
265	86	72	1		f
258	85	62	3	1 c/a 	f
259	85	61	3		f
260	85	83	1		f
261	85	76	1		f
255	84	61	4		f
256	84	74	1		f
252	83	61	5		f
253	83	71	1		f
247	81	62	2		f
248	81	69	1	temperatura ambiente	f
267	87	62	3		f
268	87	61	2	2 c/a 	f
270	88	61	3		t
271	88	62	1	1 c/a 	f
272	88	67	1		f
278	90	63	2		f
279	90	83	2		f
280	90	76	1		f
274	89	61	3	1 c/a 	f
275	89	84	1		f
276	89	76	1		f
282	91	61	4	2 c/a 	f
283	91	75	1		f
285	92	62	1	1 c/a 	f
287	93	62	1		f
288	93	61	1		f
389	125	61	3		f
290	94	61	4		f
292	94	73	1		f
294	95	61	3	2 c/a 	f
295	95	72	1		f
296	95	72	1		f
298	96	64	1		f
299	96	61	1	1 c/a 	t
300	96	76	1		f
390	125	83	1		f
304	98	61	4		f
309	100	62	1		f
310	100	61	2		f
306	99	62	2	1 c/a 	f
307	99	61	1		f
302	97	61	3	1 c/a 	f
312	101	62	1		f
313	101	61	1		f
314	101	78	1		f
315	101	86	2		f
317	102	62	3		f
318	102	61	1		f
319	102	76	1		f
321	103	61	1	1 c/a 	f
323	104	62	3		f
324	104	84	1	fría	f
326	105	61	1		f
327	105	62	1		f
328	105	65	2		f
330	106	64	1		f
331	106	85	1		f
332	106	75	2		f
334	107	61	5	1 c/a 	f
335	107	74	2		f
337	108	61	2		f
338	108	62	1		t
340	109	62	4	2 c/a 	f
341	109	79	1		f
343	110	61	1		f
344	110	62	1		f
345	110	61	1		t
347	111	61	3		f
348	111	62	3		f
349	111	82	1		f
351	112	61	4	2 c/a 	f
353	113	61	3		f
354	113	85	1		f
355	113	73	1		f
357	114	62	3	1 c/a 	f
358	114	78	1		f
360	115	64	1		f
361	115	80	1		f
363	116	62	2		f
364	116	71	1		f
366	117	61	2		f
367	117	62	2		f
369	118	61	4		f
371	119	61	1		f
372	119	62	1		f
373	119	77	1		f
375	120	63	1		f
377	121	62	2		f
379	122	61	2		f
380	122	62	1		f
382	123	62	1		f
383	123	61	1	1 c/a 	f
384	123	61	1	1 c/a 	t
386	124	63	1		f
387	124	79	1		f
392	126	64	1		f
393	126	85	1		f
394	126	86	1		f
396	127	62	1		f
397	127	61	1		f
399	128	62	4		f
401	129	61	1		f
402	129	62	1		f
403	129	71	1		f
405	130	62	4		f
407	131	62	2		f
408	131	61	1		t
410	132	62	12		f
412	133	61	1		f
413	133	62	1		f
415	134	63	1		f
416	134	71	1		f
418	135	64	1		f
419	135	84	1		f
420	135	85	1		f
422	136	62	1		f
423	136	61	1		t
425	137	62	1		f
426	137	61	1		f
427	137	73	1		f
428	137	74	1		f
430	138	61	5		f
431	138	61	1		t
433	139	63	1		f
435	140	61	1		f
436	140	62	1		t
438	141	62	3		f
440	142	61	3		f
441	142	62	1		f
443	143	63	1		f
445	144	62	3		f
446	144	61	1		f
448	145	62	2		f
449	145	61	1		t
451	146	62	1		f
452	146	75	1		f
453	146	74	1		f
455	147	61	1		f
456	147	62	1		f
458	148	61	1	1 c/a 	f
459	148	65	1		f
461	149	61	3		f
462	149	62	1		f
463	149	70	1		f
465	150	61	3		f
467	151	61	2		f
468	151	65	1		f
469	151	67	1		f
638	210	87	1		f
471	152	61	1		f
473	153	61	5	1 c/a 	f
474	153	80	1	fría	f
476	154	62	1	1 c/a 	t
477	154	63	1		f
479	155	64	1		f
480	155	64	1		f
481	155	81	2		f
482	155	85	1		f
483	155	86	1		f
485	156	63	1		f
486	156	72	1		f
488	157	61	2		f
489	157	62	1		f
490	157	80	1		f
492	158	61	3		f
493	158	83	1		f
495	159	61	3		f
496	159	65	1		f
498	160	61	2		f
499	160	85	1		f
501	161	63	1		f
502	161	83	1		f
504	162	62	3		f
506	163	61	4		f
508	164	61	3	1 c/a 	f
510	165	61	9	2 c/a 	f
512	166	62	2	1 c/a 	f
513	166	61	1		f
515	167	62	3	1 c/a 	f
517	168	61	1	1 c/a 	t
518	168	63	1		f
520	169	62	1		f
521	169	61	1		f
523	170	61	1		f
524	170	85	1		f
526	171	62	1		f
527	171	65	1		f
529	172	64	1		f
531	173	61	1		f
532	173	62	1		f
533	173	72	1		f
535	174	61	6		f
537	175	62	1		f
538	175	61	3	1 c/a 	f
540	176	63	1		f
542	177	61	2		f
544	178	61	3		f
545	178	79	1		f
547	179	62	1	1 c/a 	f
548	179	68	1		f
550	180	62	3		f
551	180	80	1		f
553	181	64	2		f
554	181	81	1		f
556	182	61	5	2 c/a 	f
557	182	62	3		f
558	182	85	3		f
560	183	62	3	2 c/a 	f
561	183	75	1	temperatura ambiente	f
563	184	62	2		f
565	185	61	2		f
567	186	61	1		f
568	186	62	1		f
569	186	75	1		f
571	187	61	3		f
572	187	62	3		f
573	187	61	1		t
575	188	61	6		f
576	188	62	1		f
577	188	79	1		f
579	189	62	2	2 c/a 	f
580	189	71	1		f
582	190	61	7		f
583	190	80	1		f
585	191	62	2		f
586	191	70	1		f
587	191	86	1		f
589	192	62	3		f
590	192	84	4	fría	f
592	193	64	3		f
594	194	62	3		f
595	194	61	1		f
596	194	70	1		f
598	195	62	1	1 c/a (Pedro)	f
600	196	61	2	Carla	f
602	197	61	3		f
603	197	86	1		f
605	198	61	2	2 c/a 	f
607	199	63	1		f
608	199	71	1		f
610	200	62	1		f
611	200	61	1		f
613	201	62	1	1 c/a 	f
614	201	61	3		f
615	201	71	1		f
617	202	64	1		f
619	203	61	4		f
621	204	62	1		f
623	205	61	1		f
624	205	61	1		t
625	205	62	3		f
627	206	61	3	3 c/a 	f
628	206	73	1		f
630	207	62	1		f
631	207	61	1		f
633	208	61	3		f
635	209	61	1		f
636	209	62	1		f
639	210	71	1		f
641	211	63	1		f
643	212	64	1		f
645	213	61	1		f
646	213	62	1		f
652	216	61	2	1 c/a 	f
648	214	61	2	1 c/a 	f
650	215	61	1	1 c/a (Bien Cocido)	f
653	216	82	1		f
655	217	63	1	c/a	f
657	218	61	2	2 c/a 	f
659	218	72	1		f
661	219	64	2		f
663	220	61	2	2 c/a 	f
664	220	62	2	2 c/a 	t
666	221	65	1		f
667	221	67	1		f
668	221	70	1		f
669	221	73	1		f
671	222	65	1		f
672	222	66	1		f
673	222	67	1		f
674	222	68	1		f
675	222	69	1		f
676	222	70	1		f
677	222	71	1		f
678	222	72	1		f
679	222	73	1		f
680	222	74	1		f
681	222	75	1		f
682	222	76	1		f
683	222	81	1		f
684	222	82	1		f
685	222	83	1		f
686	222	84	1		f
688	223	65	1		f
689	223	66	1		f
691	224	65	1	bien fria	f
692	224	66	1		f
694	225	61	1	1 c/a 	f
695	226	64	2		f
697	227	62	1	1 c/a 	f
698	227	61	2	1 c/a 	f
700	228	72	2		f
701	228	71	1		f
702	230	85	1		f
703	230	86	1		f
704	232	61	1	1 c/a 	f
706	233	61	1	1 c/a 	f
707	233	62	1	1 c/a 	f
709	234	70	1		f
710	234	75	1		f
711	234	74	1		f
712	237	69	1		f
713	237	73	1		f
714	237	77	1		f
715	240	79	1		f
716	240	84	1		f
717	240	83	1		f
718	240	80	1		f
720	241	61	1	1 c/a 	f
730	246	63	1		f
732	247	64	1		f
734	248	61	1		f
722	242	62	1	1 c/a 	f
736	249	61	1		f
743	252	62	1		f
744	252	65	1		f
738	250	61	1		f
749	250	67	1		f
751	253	68	1		f
752	253	69	1		f
753	253	70	1		f
754	253	71	1		f
755	253	72	1		f
757	254	63	1		f
758	254	76	1		f
760	255	66	3		f
761	255	73	1		f
762	255	75	2		f
764	256	61	2	1 c/a 	f
765	256	83	2		f
767	257	61	3	1 c/a 	f
768	257	62	2	1 c/a 	t
770	258	61	3		t
771	258	62	1	1 c/a 	f
772	258	70	3		f
740	251	62	1		t
741	251	63	1		f
747	251	66	1		f
774	259	61	2	1 c/a 	f
775	259	85	2		t
776	259	74	2		f
778	260	64	1		f
779	260	61	2		t
780	260	86	1		t
781	260	72	2		f
783	261	61	1	1 c/a 	f
784	261	62	1	1 c/a 	t
785	261	69	4		f
787	262	61	1		f
788	262	62	1		t
789	262	71	1		f
791	263	64	1		f
792	263	62	1		t
793	263	66	1		f
795	264	89	1	sin oregano	f
796	264	65	10	bien fria	f
\.


--
-- TOC entry 3397 (class 0 OID 24606)
-- Dependencies: 226
-- Data for Name: item_presa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_presa (cod_item, cod_presa, unidad_presa, descrip_presa) FROM stdin;
2	2	1	\N
3	1	1	\N
6	2	1	\N
7	1	1	\N
10	1	2	\N
10	2	1	\N
21	1	1	\N
21	2	1	\N
26	1	3	\N
26	2	1	\N
57	1	1	\N
58	2	1	\N
95	1	2	\N
95	2	2	\N
95	3	1	\N
99	1	2	\N
100	1	1	\N
104	1	1	\N
104	2	1	\N
105	1	1	\N
105	2	1	\N
107	2	1	\N
108	1	1	\N
110	1	1	\N
110	2	2	\N
111	2	1	\N
113	1	1	\N
113	2	1	\N
113	3	1	\N
114	1	2	\N
116	1	1	\N
116	2	1	\N
119	2	1	\N
120	1	1	\N
120	2	2	\N
125	1	2	\N
125	2	1	\N
127	1	1	\N
127	2	1	\N
128	2	1	\N
130	1	2	\N
130	2	2	\N
136	1	3	\N
136	2	3	\N
136	3	1	\N
139	1	2	\N
139	2	1	\N
140	1	2	\N
140	2	1	\N
150	1	2	\N
150	2	2	\N
151	2	1	\N
154	1	1	\N
154	2	2	\N
156	1	1	\N
156	2	1	\N
157	1	1	\N
158	2	1	\N
162	2	1	\N
165	1	1	\N
165	2	1	\N
166	1	1	\N
166	2	2	\N
170	1	2	\N
170	2	1	\N
170	3	1	\N
171	1	1	\N
171	2	1	\N
173	1	1	\N
173	2	1	\N
174	1	1	\N
174	2	2	\N
178	1	1	\N
178	2	1	\N
179	1	2	\N
184	1	2	\N
184	2	2	\N
188	1	1	\N
188	2	1	\N
190	2	1	\N
193	1	2	\N
193	2	1	\N
193	3	1	\N
203	1	1	\N
203	2	1	\N
203	3	2	\N
208	1	1	\N
208	2	1	\N
208	3	1	\N
210	1	1	\N
210	2	3	\N
210	3	1	\N
211	1	1	\N
213	1	2	\N
215	1	2	\N
215	3	1	\N
217	2	1	\N
218	1	1	\N
218	2	1	\N
218	3	1	\N
220	3	1	\N
223	1	1	\N
223	2	2	\N
223	3	1	\N
241	1	2	\N
241	2	1	\N
242	2	1	\N
242	3	1	\N
239	1	2	\N
239	2	1	\N
244	1	2	\N
250	1	5	\N
250	2	3	\N
250	3	3	\N
264	1	1	\N
258	1	2	\N
258	2	1	\N
259	1	1	\N
259	2	1	\N
259	3	1	\N
255	1	1	\N
255	2	1	\N
252	1	2	\N
252	2	2	\N
252	3	1	\N
247	1	1	\N
247	3	1	\N
267	1	2	\N
267	2	1	\N
268	1	2	\N
270	1	1	\N
270	2	1	\N
274	1	1	\N
274	2	2	\N
282	1	1	\N
282	2	1	\N
282	3	2	\N
285	2	1	\N
287	1	1	\N
288	1	1	\N
290	1	1	\N
290	2	2	\N
290	3	1	\N
294	2	1	\N
304	1	1	\N
304	2	2	\N
304	3	1	\N
310	1	1	\N
306	1	1	\N
307	2	1	\N
317	1	1	\N
317	3	1	\N
321	2	1	\N
323	1	1	\N
323	2	1	\N
323	3	1	\N
334	1	2	\N
334	2	2	\N
334	3	1	\N
340	1	3	\N
340	2	1	\N
343	1	1	\N
344	2	1	\N
345	1	1	\N
351	1	2	\N
351	2	2	\N
353	1	1	\N
353	2	2	\N
357	1	1	\N
357	2	2	\N
377	1	1	\N
377	2	1	\N
379	1	1	\N
379	2	1	\N
382	2	1	\N
383	1	1	\N
389	1	3	\N
399	1	1	\N
399	2	1	\N
401	1	1	\N
402	1	1	\N
407	2	2	\N
408	1	1	\N
412	3	1	\N
413	1	1	\N
430	1	2	\N
430	2	2	\N
430	3	1	\N
431	1	1	\N
438	1	1	\N
438	2	2	\N
440	1	1	\N
440	2	1	\N
441	1	1	\N
445	1	1	\N
445	2	2	\N
446	1	1	\N
448	1	1	\N
448	2	1	\N
449	1	1	\N
455	1	1	\N
456	1	1	\N
461	1	1	\N
461	2	1	\N
461	3	1	\N
462	2	1	\N
465	2	1	\N
465	3	1	\N
471	1	1	\N
476	1	1	\N
492	2	2	\N
492	3	1	\N
495	1	1	\N
495	2	1	\N
506	1	2	\N
506	2	2	\N
508	1	3	\N
510	1	3	\N
510	2	4	\N
510	3	2	\N
512	3	1	\N
515	1	1	\N
515	2	1	\N
515	3	1	\N
517	3	1	\N
523	1	1	\N
531	1	1	\N
532	1	1	\N
535	1	2	\N
535	2	2	\N
535	3	1	\N
537	1	1	\N
538	1	1	\N
538	2	1	\N
542	2	1	\N
542	3	1	\N
544	2	3	\N
547	3	1	\N
550	2	1	\N
550	3	2	\N
556	1	2	\N
563	1	1	\N
563	2	1	\N
565	1	2	\N
573	1	1	\N
575	1	2	\N
575	2	2	\N
575	3	2	\N
576	1	1	\N
579	2	2	\N
589	1	1	\N
589	2	2	\N
594	1	3	\N
595	2	1	\N
600	1	1	\N
600	2	1	\N
602	1	2	\N
602	3	1	\N
605	1	1	\N
605	2	1	\N
614	1	2	\N
614	3	1	\N
619	1	3	\N
619	2	1	\N
623	1	1	\N
625	3	3	\N
627	1	1	\N
627	2	1	\N
627	3	1	\N
633	1	1	\N
633	2	1	\N
633	3	1	\N
648	1	2	\N
650	1	1	\N
652	1	1	\N
652	2	1	\N
657	1	1	\N
657	2	1	\N
663	1	2	\N
664	1	2	\N
694	3	1	\N
697	1	1	\N
698	1	1	\N
698	2	1	\N
704	1	1	\N
706	1	1	\N
707	3	1	\N
720	1	1	\N
722	2	1	\N
764	2	2	\N
767	1	1	\N
767	2	1	\N
767	3	1	\N
768	2	1	\N
768	3	1	\N
770	1	1	\N
770	2	1	\N
770	3	1	\N
771	2	1	\N
774	2	2	\N
779	1	2	\N
783	3	1	\N
784	1	1	\N
\.


--
-- TOC entry 3392 (class 0 OID 16472)
-- Dependencies: 221
-- Data for Name: presa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.presa (cod_presa, nom_presa) FROM stdin;
1	Ala
2	Pi
3	Pe
\.


--
-- TOC entry 3390 (class 0 OID 16460)
-- Dependencies: 219
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (cod_producto, cod_categoria, nom_pro, descrip_pro, precio_bs, precio_arg, opciones) FROM stdin;
66	2	Fanta personal		3	300	{}
67	2	Sprite personal		3	300	{}
70	2	Sprite 600ml		6	600	{}
69	2	Fanta 600ml		3	300	{}
68	2	Coca 600ml		6	600	{}
71	2	Coca 1lt		10	1000	{}
72	2	Fanta 1lt		10	1000	{}
73	2	Sprite 1lt		10	1000	{}
74	2	Jugo valle 1lt		15	1500	{}
75	2	Salvietti 1lt		10	1000	{}
76	2	Coca 2lt		15	1500	{}
77	2	Fanta 2lt		15	1500	{}
78	2	Sprite 2lt		15	1500	{}
79	2	Salvietti 2lt		15	1500	{}
80	2	Jugo valle 2lt		20	2000	{}
81	2	Coca 3lt		20	2000	{}
82	2	Salvietti 3lt		20	2000	{}
83	2	Paceña 1lt		25	2500	{}
84	2	Huari 1lt		25	2500	{}
85	3	Porción de papa		10	1000	{}
86	3	Porción de arroz		3	300	{}
87	1	Pollo entero		100	10000	{"puro arroz","pura papa"}
61	1	Pollo de 20	Porción Simple de Pollo	20	2000	{}
62	1	Pollo de 25	Cuarta Porción de Pollo	25	2500	{}
63	1	1/2 Pollo	Medio Pollo	50	5000	{}
64	1	Pollo Entero	Pollo Entero 	100	10000	{}
65	2	Coca Personal		3	300	{"bien fria","al tiempo"}
89	4	Pizza especial	Pizza especial con extra queso	70	7000	{"sin oregano","extra oregano","sin aceituna"}
\.


--
-- TOC entry 3383 (class 0 OID 16426)
-- Dependencies: 212
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (cod_rol, rol, enlace) FROM stdin;
1	Usuario	usuario
2	Producto	producto
3	Venta	venta
4	Caja	caja
5	Cocina	cocina
\.


--
-- TOC entry 3384 (class 0 OID 16432)
-- Dependencies: 213
-- Data for Name: roles_usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles_usuarios (ci_usuario, cod_rol) FROM stdin;
1111	1
1111	2
1111	3
1111	4
1111	5
8888	2
8888	3
8888	4
123456	2
123456	3
123456	4
1234567	1
1234567	2
1234567	3
1234567	4
1234567	5
\.


--
-- TOC entry 3381 (class 0 OID 16419)
-- Dependencies: 210
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (ci_usuario, nom_usu, ap_usu, clave) FROM stdin;
1111	Pedro	Arias	$2a$08$OshKXy.KfiAbaUoxsrSO1.LXkG6r2VJlj/A59AbTumrxqBAs9fpwy
45679	James	Fernandez	$2a$08$aMlCQopiFa5WFYh1GFs7au8VoQ7HDl1GVPS669FCyKVj15ipg9eba
65321	Natali 	Aguilar	$2a$08$2h58fxiRL2HnF98QPodoPex4TCxm7q/Qro3KLJF4/H6/EPrgBkCw2
9874	Sofia	Colodro	$2a$08$ADLgOwEgFbyVWUPSNNJJu.bvvp9Xp/KFFkXkaJdQNUxsNKsQ570iK
74515	Luis	Rose	$2a$08$2hSFV7hKvGshgx3iHx2wq.XHkP6xF1Hyz67sr4S6Ds9.TDKn/9SeK
8888	Mari	Pearson	$2a$08$47ys7MgAD.gRbe7AzaOjLOTVpCNZNslENcqoXzirYuet8GiCzWCUK
123456	Abel	Laera	$2a$08$ZOy.Tx7424Zl81DGX64wyueIcx3uxMqjMdBCtGvt6WYRtepZMPXXG
1234567	Admin	Admin	$2a$08$a8/4m6Oikl5s7RAsjRovGeUI10U4h99sy5I96DxFrVwX8jfnCisN6
\.


--
-- TOC entry 3394 (class 0 OID 16479)
-- Dependencies: 223
-- Data for Name: venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venta (cod_venta, cod_caja, factura, mesa, total_bs, pagado_bs, cambio_bs, total_arg, pag_arg, cambio_arg, hora, estado, descrip_venta, vent_llevar, estado_l, ticket) FROM stdin;
32	1		12	133	\N	0	13300	13500	200	9:37	1		f	\N	32
33	1		16	190	200	10	19000	\N	0	9:37	1		f	\N	33
34	1		17	88	100	12	8800	\N	0	9:38	1		f	\N	34
35	1		\N	110	110	0	11000	\N	0	9:38	1	para leo	t	\N	35
36	1		3	45	20	0	4500	2500	0	9:39	1		f	\N	36
37	1		8	100	\N	0	10000	10000	0	9:39	1		f	\N	37
38	1		6	115	120	5	11500	\N	0	9:39	1		f	\N	38
39	1		\N	85	100	15	8500	\N	0	9:40	1		f	\N	39
40	1		\N	85	100	15	8500	\N	0	9:40	1		f	\N	40
41	1		\N	95	\N	0	9500	10000	500	9:40	1		f	\N	41
42	1		\N	80	\N	0	8000	8000	0	9:40	1		f	\N	42
1	1		1	50	50	0	5000	\N	0	8:30	1		f	\N	1
2	1		2	60	\N	0	6000	6000	0	8:31	1		f	\N	2
43	2		1	85	100	15	8500	\N	0	9:43	1		f	\N	1
3	1		\N	60	100	40	6000	\N	0	8:31	1	Tomas	t	\N	3
44	2		\N	125	130	5	12500	\N	0	9:43	1		f	\N	2
5	1		\N	40	40	0	4000	\N	0	8:41	1		f	\N	5
6	1		5	65	50	0	6500	1500	0	8:42	1		f	\N	6
45	2		3	120	\N	0	12000	12000	0	9:43	1		f	\N	3
7	1		8	53	60	7	5300	\N	0	8:45	1		f	\N	7
8	1		\N	100	\N	0	10000	10000	0	8:53	1		t	\N	8
9	1		15	100	50	0	10000	10000	5000	8:55	1		f	\N	9
10	1		\N	120	\N	0	12000	12000	0	8:56	1		f	\N	10
12	1		\N	20	20	0	2000	2500	2500	9:00	1		t	\N	12
13	1		\N	20	50	30	2000	\N	0	9:00	1		t	\N	13
14	1		\N	60	60	0	6000	\N	0	9:01	1	T c/a	f	\N	14
15	1		\N	60	60	0	6000	\N	0	9:02	1	Aderezo de Pomos	t	\N	15
17	1		\N	53	\N	0	5300	6000	700	9:04	1		f	\N	17
18	1		\N	85	\N	0	8500	8500	0	9:06	1		t	\N	18
19	1		\N	40	40	0	4000	10000	10000	9:08	1		f	\N	19
20	1		20	60	100	40	6000	\N	0	9:08	1		f	\N	20
21	1		\N	115	115	75	11500	7500	0	9:11	1		f	\N	21
16	1		\N	245	300	55	24500	\N	0	9:03	1		f	\N	16
4	1		\N	70	70	0	7000	\N	0	8:41	1	Bien cocido	t	\N	4
11	1		\N	90	100	10	9000	\N	0	8:58	1		f	\N	11
22	1		\N	65	65	0	6500	\N	0	9:13	1	T c/a	t	\N	22
23	1		\N	6	46	0	600	\N	0	9:15	1		f	\N	23
24	1		\N	75	75	0	7500	\N	0	9:15	1		f	\N	24
25	1		\N	50	50	0	5000	\N	0	9:16	1	T c/a	t	\N	25
26	1		\N	100	\N	0	10000	10000	0	9:16	1		f	\N	26
27	1		\N	25	10	0	2500	1500	0	9:18	1		f	\N	27
28	1		9	56	\N	0	5600	5600	0	9:19	1		f	\N	28
29	1		\N	200	\N	0	20000	20000	0	9:25	1		f	\N	29
30	1		\N	65	\N	0	6500	7000	500	9:26	1		t	\N	30
31	1		1	45	50	5	4500	\N	0	9:36	1		f	\N	31
46	2		4	200	\N	0	20000	20000	0	9:44	1		f	\N	4
47	2		11	160	\N	0	16000	16000	0	9:44	1		f	\N	5
48	2		6	70	100	30	7000	\N	0	9:45	1		f	\N	6
49	2		\N	100	100	0	10000	\N	0	9:45	1	para Marcelo	t	\N	7
50	2		16	120	130	10	12000	\N	0	9:46	1		f	\N	8
51	2		17	60	100	40	6000	\N	0	9:46	1		f	\N	9
52	2		18	105	120	15	10500	\N	0	9:46	1		f	\N	10
53	2		19	140	150	10	14000	\N	0	9:47	1		f	\N	11
54	2		20	128	\N	0	12800	12800	0	9:47	1		f	\N	12
55	2		\N	140	\N	0	14000	14000	0	9:48	1		f	\N	13
56	2		6	140	150	10	14000	\N	0	9:48	1		f	\N	14
57	2		5	110	\N	0	11000	11000	0	9:49	1		f	\N	15
58	2		9	120	\N	0	12000	12000	0	9:49	1		f	\N	16
59	2		16	135	140	5	13500	\N	0	9:49	1		f	\N	17
60	2		1	155	200	45	15500	\N	0	9:50	1		f	\N	18
61	2		5	80	80	0	8000	\N	0	20:34	1	Bien cocido	t	\N	19
62	2		\N	200	400	200	20000	\N	0	20:35	1		f	\N	20
63	2		\N	95	100	5	9500	\N	0	20:36	1	2 c/a	f	\N	21
64	2		\N	81	100	19	8100	\N	0	20:37	1	T c/a	f	\N	22
65	2		\N	95	75	0	9500	2000	0	20:37	1		f	\N	23
66	2		\N	50	50	0	5000	\N	0	20:40	1	Aderezo de Pomos T c/a	t	\N	24
67	2		\N	75	80	5	7500	\N	0	20:41	1		t	\N	25
68	2		\N	125	140	15	12500	\N	0	20:42	1		f	\N	26
69	2		\N	40	40	0	4000	\N	0	20:43	1		f	\N	27
70	2		\N	60	\N	0	6000	6000	0	20:43	1		f	\N	28
71	2		\N	95	65	0	9500	3000	0	20:44	1		f	\N	29
72	2		\N	23	23	0	2300	\N	0	20:45	1		f	\N	30
73	2		\N	80	80	0	8000	\N	0	20:46	1		f	\N	31
74	2		\N	190	200	10	19000	\N	0	20:47	1	Bien cocido	f	\N	32
75	2		\N	170	100	0	17000	7000	0	20:48	1		f	\N	33
76	2		\N	60	\N	0	6000	6000	0	20:49	1	Aderezo de Pomos	t	\N	34
77	2		18	145	200	55	14500	\N	0	20:50	1		f	\N	35
79	2		12	115	115	0	11500	\N	0	20:52	1		f	\N	37
78	2		3	100	100	0	10000	\N	0	20:51	1		f	\N	36
80	2		4	46	46	0	4600	\N	0	20:54	1		f	\N	38
82	2		\N	220	300	80	22000	\N	0	20:57	1	Bien cocido	t	\N	40
84	2		20	95	100	5	9500	\N	0	20:59	1		f	\N	42
83	2		1	110	110	0	11000	\N	0	20:58	1		f	\N	41
81	2		0	53	60	7	5300	\N	0	20:56	1		f	\N	39
86	2		5	80	80	0	8000	\N	0	21:01	1		f	\N	44
85	2		3	175	180	5	17500	\N	0	21:00	1		f	\N	43
87	2		13	115	115	0	11500	\N	0	21:03	1		f	\N	45
88	2		2	88	90	2	8800	\N	0	21:04	1		f	\N	46
90	2		16	165	100	0	16500	6500	0	21:07	1		f	\N	48
89	2		8	100	\N	0	10000	10000	0	21:05	1		f	\N	47
91	2		\N	90	90	0	9000	\N	0	21:08	1		f	\N	49
92	2		7	25	25	0	2500	\N	0	21:09	1		f	\N	50
93	3		1	45	\N	0	4500	4500	0	21:17	1	T c/a	f	\N	1
157	9		12	85	85	0	8500	\N	0	22:34	1		f	\N	9
94	3		6	90	80	0	9000	1000	0	21:18	1		f	\N	2
95	3		3	80	100	20	8000	\N	0	21:21	1		f	\N	3
96	3		8	135	140	5	13500	\N	0	21:22	1		f	\N	4
155	9		5	253	300	47	25300	\N	0	22:31	3		f	\N	7
98	3		\N	80	80	0	8000	\N	0	21:24	1		t	\N	6
100	3		17	65	60	0	6500	500	0	21:26	1	T c/a	f	\N	8
99	3		10	70	80	10	7000	\N	0	21:25	1		f	\N	7
97	3		13	60	60	0	6000	\N	0	21:23	1		f	\N	5
101	3		\N	66	60	0	6600	600	0	21:28	1		f	\N	9
102	3		\N	110	\N	0	11000	11000	0	21:29	1	Bien cocido	f	\N	10
103	3		\N	20	20	0	2000	\N	0	21:29	1	Aderezo de Pomos Bien cocido	t	\N	11
104	3		20	100	100	0	10000	\N	0	21:31	1		f	\N	12
105	3		2	51	100	49	5100	\N	0	21:40	1		f	\N	13
106	3		11	130	\N	0	13000	13000	0	21:41	1		f	\N	14
107	3		3	130	200	70	13000	\N	0	21:42	1		f	\N	15
108	3		6	65	70	5	6500	\N	0	21:43	1		f	\N	16
109	3		13	115	120	5	11500	\N	0	22:04	1		f	\N	17
110	3		7	65	\N	0	6500	7000	500	22:04	1		f	\N	18
111	3		13	155	\N	0	15500	15500	0	22:05	1		f	\N	19
112	3		\N	80	\N	0	8000	8000	0	22:05	1	Alejandra	t	\N	20
113	3		8	80	\N	0	8000	8000	0	22:06	1		f	\N	21
114	3		9	90	\N	0	9000	9000	0	22:06	1		f	\N	22
115	3		14	120	120	0	12000	\N	0	22:07	1		f	\N	23
116	3		11	60	60	0	6000	\N	0	22:07	1		f	\N	24
117	3		\N	90	100	10	9000	\N	0	22:07	1		f	\N	25
118	3		\N	80	100	20	8000	\N	0	22:07	1		f	\N	26
119	3		20	60	100	40	6000	\N	0	22:08	1		f	\N	27
120	3		\N	50	50	0	5000	\N	0	22:08	1	Alicia	t	\N	28
121	4		1	50	100	50	5000	\N	0	22:11	1		f	\N	1
122	4		2	65	100	35	6500	\N	0	22:11	1		f	\N	2
123	4		3	65	\N	0	6500	7000	500	22:12	1		f	\N	3
124	4		4	65	\N	0	6500	7000	500	22:12	1		f	\N	4
125	4		5	85	\N	0	8500	9000	500	22:12	1		f	\N	5
126	4		6	113	120	7	11300	\N	0	22:12	1		f	\N	6
127	4		\N	45	50	5	4500	\N	0	22:13	1	para leo	t	\N	7
128	5		1	100	100	0	10000	\N	0	22:13	1		f	\N	1
129	5		2	55	100	45	5500	\N	0	22:13	1		f	\N	2
130	5		\N	100	\N	0	10000	10000	0	22:14	1	para Marcelo	t	\N	3
131	5		7	70	\N	0	7000	7000	0	22:14	1		f	\N	4
132	6		\N	300	300	0	30000	\N	0	22:15	1	para Tomas	t	\N	1
133	6		\N	45	50	5	4500	\N	0	22:15	1		f	\N	2
134	6		\N	60	100	40	6000	\N	0	22:15	1		f	\N	3
135	6		\N	135	\N	0	13500	13500	0	22:15	1		f	\N	4
136	7		1	45	50	5	4500	\N	0	22:16	1		f	\N	1
137	7		2	70	100	30	7000	\N	0	22:16	1		f	\N	2
138	7		3	120	120	0	12000	\N	0	22:16	1		f	\N	3
139	7		\N	50	50	0	5000	\N	0	22:16	1		f	\N	4
140	7		5	45	50	5	4500	\N	0	22:17	1		f	\N	5
141	8		\N	75	100	25	7500	\N	0	22:18	1		f	\N	1
142	8		\N	85	100	15	8500	\N	0	22:18	1		f	\N	2
143	8		\N	50	100	50	5000	\N	0	22:18	1		f	\N	3
144	8		5	95	\N	0	9500	9500	0	22:18	1		f	\N	4
145	8		6	70	\N	0	7000	7000	0	22:18	1		f	\N	5
146	8		7	50	\N	0	5000	5000	0	22:19	1		f	\N	6
147	8		\N	45	\N	0	4500	4500	0	22:19	1	para Marcelo	t	\N	7
148	8		\N	23	23	0	2300	\N	0	22:23	1		f	\N	8
150	9		8	60	60	0	6000	\N	0	22:25	3		f	\N	2
154	9		7	75	80	5	7500	\N	0	22:30	3		f	\N	6
156	9		1	60	60	0	6000	\N	0	22:33	1	T c/a	f	\N	8
158	9		19	85	100	15	8500	\N	0	22:35	1		f	\N	10
159	9		15	63	70	7	6300	\N	0	22:36	1		f	\N	11
160	9		\N	50	50	0	5000	\N	0	22:38	1		f	\N	12
161	9		3	75	75	0	7500	\N	0	22:39	1		f	\N	13
162	9		11	75	75	0	7500	\N	0	22:39	1		f	\N	14
163	9		18	80	80	0	8000	\N	0	22:43	1		f	\N	15
164	9		\N	60	60	0	6000	\N	0	22:43	1		f	\N	16
165	9		15	180	180	0	18000	\N	0	22:44	1	Aderezo de Pomos	t	\N	17
166	9		11	50	\N	0	5000	5000	0	22:45	1		f	\N	18
167	9		7	75	\N	0	7500	7570	100	22:48	1		f	\N	19
168	9		2	70	100	30	7000	\N	0	23:09	1		f	\N	20
169	9		\N	45	45	0	4500	\N	0	23:10	1	Aderezo de Pomos T c/a	t	\N	21
170	9		5	30	\N	0	3000	3000	0	23:11	1		f	\N	22
151	9		16	46	50	4	4600	\N	0	22:26	3		f	\N	3
152	9		\N	20	\N	0	2000	2000	0	22:27	3	Aderezo de Pomos	t	\N	4
153	9		20	120	\N	0	12000	12000	0	22:29	3		f	\N	5
171	9		0	28	28	0	2800	\N	0	23:11	1		f	\N	23
172	9		4	100	100	0	10000	\N	0	23:12	1		f	\N	24
173	9		6	55	60	5	5500	\N	0	23:13	1		f	\N	25
174	9		\N	120	120	0	12000	\N	0	23:14	1	Adriana	t	\N	26
175	9		17	85	90	5	8500	\N	0	23:15	1		f	\N	27
176	9		\N	50	50	0	5000	\N	0	23:16	1	Bien cocido Aderezo de Pomos	t	\N	28
177	9		13	40	40	0	4000	\N	0	23:17	1		f	\N	29
178	9		8	75	\N	0	7500	8000	500	23:18	1		f	\N	30
179	9		0	31	31	0	3100	\N	0	23:19	1		f	\N	31
180	9		6	95	\N	0	9500	10000	500	23:20	1		f	\N	32
181	9		\N	220	200	0	22000	2000	0	23:22	1	Teresa	t	\N	33
182	9		10	205	205	0	20500	\N	0	23:23	1		f	\N	34
183	9		17	85	\N	0	8500	8500	0	23:25	1		f	\N	35
184	9		1	50	60	10	5000	\N	0	23:25	1		f	\N	36
185	9		3	40	40	0	4000	\N	0	23:26	1	T c/a	f	\N	37
186	9		1	55	60	5	5500	\N	0	23:27	1	T c/a	f	\N	38
187	9		15	155	160	5	15500	\N	0	23:29	1	T c/a	f	\N	39
188	9		13	160	200	40	16000	\N	0	23:30	1		f	\N	40
189	9		12	60	\N	0	6000	6000	0	23:32	1		f	\N	41
190	9		8	160	50	0	16000	11000	0	23:35	1		f	\N	42
191	9		18	59	\N	0	5900	6000	100	23:36	1		f	\N	43
192	9		20	175	\N	0	17500	18000	500	23:38	1	T c/a	f	\N	44
193	9		\N	300	300	0	30000	\N	0	23:39	1	T c/a Bien cocido	t	\N	45
194	9		6	101	102	1	10100	\N	0	23:40	1		f	\N	46
195	9		\N	25	25	0	2500	\N	0	23:42	1		t	\N	47
196	9		\N	40	40	0	4000	\N	0	23:42	1		t	\N	48
197	9		4	63	80	17	6300	\N	0	23:44	1		f	\N	49
198	9		3	40	50	10	4000	\N	0	23:45	1	Bien cocido	f	\N	50
199	9		14	60	100	40	6000	\N	0	23:46	1		f	\N	51
200	9		\N	45	50	5	4500	\N	0	23:46	1	Aderezo de Pomos	t	\N	52
201	9		\N	95	100	5	9500	\N	0	23:47	1		f	\N	53
202	9		\N	100	100	0	10000	\N	0	23:48	1	Rosario	t	\N	54
203	9		2	80	100	20	8000	\N	0	23:49	1		f	\N	55
204	9		\N	25	30	5	2500	\N	0	23:56	1	Jorge	t	\N	56
205	9		17	115	115	0	11500	\N	0	23:57	1		f	\N	57
206	9		0	70	80	10	7000	\N	0	23:59	1		f	\N	58
207	9		1	45	60	15	4500	\N	0	23:59	1		f	\N	59
208	9		\N	60	60	0	6000	\N	0	23:59	1		t	\N	60
209	9		\N	45	\N	0	4500	\N	0	0:00	1	Andrea	t	\N	61
210	11		\N	110	100	0	11000	\N	0	8:46	1		f	\N	1
211	11		\N	50	100	50	5000	\N	0	8:46	1		f	\N	2
212	12		\N	100	100	0	10000	\N	0	8:54	1		f	\N	1
218	16		\N	50	40	0	5000	1000	0	15:05	1		f	\N	1
149	9		9	91	100	9	9100	\N	0	22:24	1		f	\N	1
213	13		\N	45	50	5	4500	\N	0	9:05	1		f	\N	1
219	16		\N	200	200	0	20000	\N	0	15:07	1		t	\N	2
214	13		\N	40	40	0	4000	\N	0	9:14	1		f	\N	2
220	16		\N	90	100	10	9000	\N	0	15:07	1		f	\N	3
221	16		\N	22	30	8	2200	\N	0	15:09	1		f	\N	4
222	16		\N	184	200	16	18400	\N	0	15:10	1		f	\N	5
223	17		\N	6	10	4	600	\N	0	15:11	1		f	\N	1
224	17		\N	6	\N	0	600	1000	400	15:12	1		f	\N	2
215	14		\N	20	10	0	2000	1000	0	11:52	1		f	\N	1
217	15		5	50	\N	0	5000	5000	0	11:29	1		f	\N	2
225	17		\N	20	100	80	2000	\N	0	15:21	1		f	\N	3
240	18		\N	85	\N	0	8500	9000	500	15:28	1		f	\N	4
226	17		\N	200	200	0	20000	\N	0	15:22	1		f	\N	4
216	15		\N	60	100	40	6000	\N	0	11:15	1		f	\N	1
227	17		10	65	70	5	6500	\N	0	15:23	1		f	\N	5
228	17		\N	30	\N	0	3000	3000	0	15:24	1		f	\N	6
230	17		\N	13	\N	0	1300	2000	700	15:25	1		f	\N	7
232	17		\N	20	20	0	2000	\N	0	15:25	1		f	\N	8
234	18		\N	31	40	9	3100	\N	0	15:27	1		f	\N	2
237	18		\N	28	\N	0	2800	3000	200	15:28	1		f	\N	3
246	19		\N	50	50	0	5000	\N	0	11:10	1		f	\N	6
247	19		\N	100	\N	0	10000	\N	0	11:12	1		f	\N	7
248	19		\N	20	50	30	2000	\N	0	11:13	1		f	\N	8
242	19		\N	25	\N	0	2500	\N	0	11:06	1		f	\N	2
233	18		3	45	50	5	4500	\N	0	15:26	3		f	\N	1
249	19		\N	20	\N	0	2000	\N	0	18:46	1		f	\N	9
255	20		11	39	\N	0	3900	4000	100	15:04	1		f	\N	6
241	19		2	20	\N	0	2000	\N	0	10:47	1		f	\N	1
251	20		7	78	\N	0	7800	8300	500	15:02	3		f	\N	2
253	20		3	35	40	5	3500	\N	0	15:03	1		f	\N	4
259	20		9	90	\N	0	9000	9000	0	15:06	1		f	\N	10
257	20		14	110	110	0	11000	\N	0	15:05	2		f	\N	8
252	20		7	28	20	0	2800	800	0	15:02	3		f	\N	3
260	20		12	163	200	37	16300	\N	0	15:07	1		f	\N	11
261	20		15	57	60	3	5700	\N	0	15:07	1		f	\N	12
262	20		14	55	100	45	5500	\N	0	15:08	1		f	\N	13
263	20		18	128	200	72	12800	\N	0	15:09	1		f	\N	14
254	20		2	65	70	5	6500	\N	0	15:03	3		f	\N	5
256	20		\N	90	\N	0	9000	10000	1000	15:04	2		f	\N	7
258	20		5	103	110	7	10300	\N	0	15:05	1		f	\N	9
250	20		5	23	23	0	2300	\N	0	15:01	3		f	\N	1
264	20		4	100	60	10	10000	5000	0	15:21	1	Bien cocido	f	\N	15
\.


--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 214
-- Name: caja_cod_caja_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.caja_cod_caja_seq', 1, false);


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 216
-- Name: categoria_cod_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_cod_categoria_seq', 4, false);


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 224
-- Name: detalle_venta_cod_item_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_venta_cod_item_seq', 5, true);


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 220
-- Name: presa_cod_presa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.presa_cod_presa_seq', 1, false);


--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 218
-- Name: producto_cod_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_cod_producto_seq', 89, true);


--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 211
-- Name: roles_cod_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_cod_rol_seq', 1, false);


--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 209
-- Name: usuario_ci_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_ci_usuario_seq', 1, false);


--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 222
-- Name: venta_cod_venta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venta_cod_venta_seq', 9, true);


--
-- TOC entry 3220 (class 2606 OID 16451)
-- Name: caja caja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.caja
    ADD CONSTRAINT caja_pkey PRIMARY KEY (cod_caja);


--
-- TOC entry 3222 (class 2606 OID 16458)
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (cod_categoria);


--
-- TOC entry 3230 (class 2606 OID 24582)
-- Name: detalle_venta detalle_venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_pkey PRIMARY KEY (cod_item);


--
-- TOC entry 3226 (class 2606 OID 16477)
-- Name: presa presa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.presa
    ADD CONSTRAINT presa_pkey PRIMARY KEY (cod_presa);


--
-- TOC entry 3224 (class 2606 OID 16465)
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (cod_producto);


--
-- TOC entry 3218 (class 2606 OID 16431)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (cod_rol);


--
-- TOC entry 3232 (class 2606 OID 24610)
-- Name: item_presa unique_item_presa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_presa
    ADD CONSTRAINT unique_item_presa UNIQUE (cod_item, cod_presa);


--
-- TOC entry 3216 (class 2606 OID 16424)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (ci_usuario);


--
-- TOC entry 3228 (class 2606 OID 16484)
-- Name: venta venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_pkey PRIMARY KEY (cod_venta);


--
-- TOC entry 3238 (class 2606 OID 24588)
-- Name: detalle_venta detalle_venta_cod_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_cod_producto_fkey FOREIGN KEY (cod_producto) REFERENCES public.producto(cod_producto);


--
-- TOC entry 3237 (class 2606 OID 24583)
-- Name: detalle_venta detalle_venta_cod_venta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_venta
    ADD CONSTRAINT detalle_venta_cod_venta_fkey FOREIGN KEY (cod_venta) REFERENCES public.venta(cod_venta);


--
-- TOC entry 3239 (class 2606 OID 24611)
-- Name: item_presa item_presa_cod_item_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_presa
    ADD CONSTRAINT item_presa_cod_item_fkey FOREIGN KEY (cod_item) REFERENCES public.detalle_venta(cod_item);


--
-- TOC entry 3240 (class 2606 OID 24616)
-- Name: item_presa item_presa_cod_presa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_presa
    ADD CONSTRAINT item_presa_cod_presa_fkey FOREIGN KEY (cod_presa) REFERENCES public.presa(cod_presa);


--
-- TOC entry 3235 (class 2606 OID 16466)
-- Name: producto producto_cod_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_cod_categoria_fkey FOREIGN KEY (cod_categoria) REFERENCES public.categoria(cod_categoria);


--
-- TOC entry 3233 (class 2606 OID 16435)
-- Name: roles_usuarios roles_usuarios_ci_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_usuarios
    ADD CONSTRAINT roles_usuarios_ci_usuario_fkey FOREIGN KEY (ci_usuario) REFERENCES public.usuario(ci_usuario);


--
-- TOC entry 3234 (class 2606 OID 16440)
-- Name: roles_usuarios roles_usuarios_cod_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_usuarios
    ADD CONSTRAINT roles_usuarios_cod_rol_fkey FOREIGN KEY (cod_rol) REFERENCES public.roles(cod_rol);


--
-- TOC entry 3236 (class 2606 OID 16485)
-- Name: venta venta_cod_caja_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venta
    ADD CONSTRAINT venta_cod_caja_fkey FOREIGN KEY (cod_caja) REFERENCES public.caja(cod_caja);


-- Completed on 2025-10-08 23:03:17

--
-- PostgreSQL database dump complete
--

