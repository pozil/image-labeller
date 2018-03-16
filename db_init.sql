--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 10.0

-- Started on 2018-03-16 15:34:29 CET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12655)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2451 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 193 (class 1259 OID 24662)
-- Name: config; Type: TABLE; Schema: public; Owner: img
--

CREATE TABLE config (
    key character varying(255) NOT NULL,
    value json
);


ALTER TABLE config OWNER TO img;

--
-- TOC entry 188 (class 1259 OID 24600)
-- Name: images; Type: TABLE; Schema: public; Owner: img
--

CREATE TABLE images (
    id integer NOT NULL,
    filename character varying NOT NULL
);


ALTER TABLE images OWNER TO img;

--
-- TOC entry 187 (class 1259 OID 24598)
-- Name: image_id_seq; Type: SEQUENCE; Schema: public; Owner: img
--

CREATE SEQUENCE image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE image_id_seq OWNER TO img;

--
-- TOC entry 2452 (class 0 OID 0)
-- Dependencies: 187
-- Name: image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: img
--

ALTER SEQUENCE image_id_seq OWNED BY images.id;


--
-- TOC entry 186 (class 1259 OID 24587)
-- Name: labels; Type: TABLE; Schema: public; Owner: img
--

CREATE TABLE labels (
    id smallint NOT NULL,
    label character varying NOT NULL
);


ALTER TABLE labels OWNER TO img;

--
-- TOC entry 185 (class 1259 OID 24585)
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: img
--

CREATE SEQUENCE labels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE labels_id_seq OWNER TO img;

--
-- TOC entry 2453 (class 0 OID 0)
-- Dependencies: 185
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: img
--

ALTER SEQUENCE labels_id_seq OWNED BY labels.id;


--
-- TOC entry 192 (class 1259 OID 24625)
-- Name: object_boxes; Type: TABLE; Schema: public; Owner: img
--

CREATE TABLE object_boxes (
    id integer NOT NULL,
    image_id integer NOT NULL,
    label_id smallint NOT NULL,
    x integer NOT NULL,
    y integer NOT NULL,
    w integer NOT NULL,
    h integer NOT NULL
);


ALTER TABLE object_boxes OWNER TO img;

--
-- TOC entry 189 (class 1259 OID 24619)
-- Name: object_boxes_id_seq; Type: SEQUENCE; Schema: public; Owner: img
--

CREATE SEQUENCE object_boxes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE object_boxes_id_seq OWNER TO img;

--
-- TOC entry 2454 (class 0 OID 0)
-- Dependencies: 189
-- Name: object_boxes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: img
--

ALTER SEQUENCE object_boxes_id_seq OWNED BY object_boxes.id;


--
-- TOC entry 190 (class 1259 OID 24621)
-- Name: object_boxes_image_id_seq; Type: SEQUENCE; Schema: public; Owner: img
--

CREATE SEQUENCE object_boxes_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE object_boxes_image_id_seq OWNER TO img;

--
-- TOC entry 2455 (class 0 OID 0)
-- Dependencies: 190
-- Name: object_boxes_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: img
--

ALTER SEQUENCE object_boxes_image_id_seq OWNED BY object_boxes.image_id;


--
-- TOC entry 191 (class 1259 OID 24623)
-- Name: object_boxes_label_seq; Type: SEQUENCE; Schema: public; Owner: img
--

CREATE SEQUENCE object_boxes_label_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE object_boxes_label_seq OWNER TO img;

--
-- TOC entry 2456 (class 0 OID 0)
-- Dependencies: 191
-- Name: object_boxes_label_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: img
--

ALTER SEQUENCE object_boxes_label_seq OWNED BY object_boxes.label_id;


--
-- TOC entry 194 (class 1259 OID 24670)
-- Name: session; Type: TABLE; Schema: public; Owner: img
--

CREATE TABLE session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE session OWNER TO img;

--
-- TOC entry 2296 (class 2604 OID 24603)
-- Name: images id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('image_id_seq'::regclass);


--
-- TOC entry 2295 (class 2604 OID 24590)
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY labels ALTER COLUMN id SET DEFAULT nextval('labels_id_seq'::regclass);


--
-- TOC entry 2297 (class 2604 OID 24628)
-- Name: object_boxes id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes ALTER COLUMN id SET DEFAULT nextval('object_boxes_id_seq'::regclass);


--
-- TOC entry 2298 (class 2604 OID 24629)
-- Name: object_boxes image_id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes ALTER COLUMN image_id SET DEFAULT nextval('object_boxes_image_id_seq'::regclass);


--
-- TOC entry 2299 (class 2604 OID 24630)
-- Name: object_boxes label_id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes ALTER COLUMN label_id SET DEFAULT nextval('object_boxes_label_seq'::regclass);


--
-- TOC entry 2438 (class 0 OID 24600)
-- Dependencies: 188
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: img
--

COPY images (id, filename) FROM stdin;
\.


--
-- TOC entry 2436 (class 0 OID 24587)
-- Dependencies: 186
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: img
--

COPY labels (id, label) FROM stdin;
\.


--
-- TOC entry 2442 (class 0 OID 24625)
-- Dependencies: 192
-- Data for Name: object_boxes; Type: TABLE DATA; Schema: public; Owner: img
--

COPY object_boxes (id, image_id, label_id, x, y, w, h) FROM stdin;
\.


--
-- TOC entry 2444 (class 0 OID 24670)
-- Dependencies: 194
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: img
--

COPY session (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 2457 (class 0 OID 0)
-- Dependencies: 187
-- Name: image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: img
--

SELECT pg_catalog.setval('image_id_seq', 1, true);


--
-- TOC entry 2458 (class 0 OID 0)
-- Dependencies: 185
-- Name: labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: img
--

SELECT pg_catalog.setval('labels_id_seq', 1, true);


--
-- TOC entry 2459 (class 0 OID 0)
-- Dependencies: 189
-- Name: object_boxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: img
--

SELECT pg_catalog.setval('object_boxes_id_seq', 1, true);


--
-- TOC entry 2460 (class 0 OID 0)
-- Dependencies: 190
-- Name: object_boxes_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: img
--

SELECT pg_catalog.setval('object_boxes_image_id_seq', 1, false);


--
-- TOC entry 2461 (class 0 OID 0)
-- Dependencies: 191
-- Name: object_boxes_label_seq; Type: SEQUENCE SET; Schema: public; Owner: img
--

SELECT pg_catalog.setval('object_boxes_label_seq', 1, false);


--
-- TOC entry 2313 (class 2606 OID 24669)
-- Name: config config_pkey; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY config
    ADD CONSTRAINT config_pkey PRIMARY KEY (key);


--
-- TOC entry 2305 (class 2606 OID 24608)
-- Name: images image_pkey; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY images
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- TOC entry 2301 (class 2606 OID 24595)
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- TOC entry 2311 (class 2606 OID 24632)
-- Name: object_boxes object_boxes_pkey; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes
    ADD CONSTRAINT object_boxes_pkey PRIMARY KEY (id);


--
-- TOC entry 2315 (class 2606 OID 24677)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2307 (class 2606 OID 24679)
-- Name: images unique_file; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY images
    ADD CONSTRAINT unique_file UNIQUE (filename);


--
-- TOC entry 2303 (class 2606 OID 24610)
-- Name: labels unique_label; Type: CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY labels
    ADD CONSTRAINT unique_label UNIQUE (label);


--
-- TOC entry 2308 (class 1259 OID 24644)
-- Name: fki_label_id; Type: INDEX; Schema: public; Owner: img
--

CREATE INDEX fki_label_id ON object_boxes USING btree (label_id);


--
-- TOC entry 2309 (class 1259 OID 24633)
-- Name: image_id; Type: INDEX; Schema: public; Owner: img
--

CREATE INDEX image_id ON object_boxes USING btree (image_id);


--
-- TOC entry 2316 (class 2606 OID 24645)
-- Name: object_boxes image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes
    ADD CONSTRAINT image_id_fkey FOREIGN KEY (image_id) REFERENCES images(id);


--
-- TOC entry 2317 (class 2606 OID 24639)
-- Name: object_boxes label_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes
    ADD CONSTRAINT label_id_fkey FOREIGN KEY (label_id) REFERENCES labels(id);


-- Completed on 2018-03-16 15:34:29 CET

--
-- PostgreSQL database dump complete
--

