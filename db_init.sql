SET client_encoding = 'UTF8';
SET default_tablespace = '';
SET default_with_oids = false;

--
-- TOC entry 188 (class 1259 OID 24600)
-- Name: images; Type: TABLE; Schema: public; Owner: img
--

CREATE TABLE images (
    id integer NOT NULL,
    file character varying NOT NULL
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
-- TOC entry 2434 (class 0 OID 0)
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
-- TOC entry 2435 (class 0 OID 0)
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
-- TOC entry 2436 (class 0 OID 0)
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
-- TOC entry 2437 (class 0 OID 0)
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
-- TOC entry 2438 (class 0 OID 0)
-- Dependencies: 191
-- Name: object_boxes_label_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: img
--

ALTER SEQUENCE object_boxes_label_seq OWNED BY object_boxes.label_id;


--
-- TOC entry 2286 (class 2604 OID 24603)
-- Name: images id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('image_id_seq'::regclass);


--
-- TOC entry 2285 (class 2604 OID 24590)
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY labels ALTER COLUMN id SET DEFAULT nextval('labels_id_seq'::regclass);


--
-- TOC entry 2287 (class 2604 OID 24628)
-- Name: object_boxes id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes ALTER COLUMN id SET DEFAULT nextval('object_boxes_id_seq'::regclass);


--
-- TOC entry 2288 (class 2604 OID 24629)
-- Name: object_boxes image_id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes ALTER COLUMN image_id SET DEFAULT nextval('object_boxes_image_id_seq'::regclass);


--
-- TOC entry 2289 (class 2604 OID 24630)
-- Name: object_boxes label_id; Type: DEFAULT; Schema: public; Owner: img
--

ALTER TABLE ONLY object_boxes ALTER COLUMN label_id SET DEFAULT nextval('object_boxes_label_seq'::regclass);

-- Table: public.config

-- DROP TABLE public.config;

CREATE TABLE public.config
(
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    value json,
    CONSTRAINT config_pkey PRIMARY KEY (key)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.config
    OWNER to img;

CREATE TABLE "session" (
	"sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE public.session OWNER to img;
