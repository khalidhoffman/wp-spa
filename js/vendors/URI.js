/*! URI.js v1.17.0 http://medialize.github.io/URI.js/ */
/* build contains: IPv6.js, punycode.js, SecondLevelDomains.js, URI.js, URITemplate.js, jquery.URI.js */
(function (f, h) {
    "object" === typeof exports ? module.exports = h() : "function" === typeof define && define.amd ? define(h) : f.IPv6 = h(f)
})(this, function (f) {
    var h = f && f.IPv6;
    return {
        best: function (g) {
            g = g.toLowerCase().split(":");
            var f = g.length, b = 8;
            "" === g[0] && "" === g[1] && "" === g[2] ? (g.shift(), g.shift()) : "" === g[0] && "" === g[1] ? g.shift() : "" === g[f - 1] && "" === g[f - 2] && g.pop();
            f = g.length;
            -1 !== g[f - 1].indexOf(".") && (b = 7);
            var l;
            for (l = 0; l < f && "" !== g[l]; l++);
            if (l < b)for (g.splice(l, 1, "0000"); g.length < b;)g.splice(l, 0, "0000");
            for (l = 0; l < b; l++) {
                for (var f =
                    g[l].split(""), h = 0; 3 > h; h++)if ("0" === f[0] && 1 < f.length)f.splice(0, 1); else break;
                g[l] = f.join("")
            }
            var f = -1, n = h = 0, u = -1, A = !1;
            for (l = 0; l < b; l++)A ? "0" === g[l] ? n += 1 : (A = !1, n > h && (f = u, h = n)) : "0" === g[l] && (A = !0, u = l, n = 1);
            n > h && (f = u, h = n);
            1 < h && g.splice(f, h, "");
            f = g.length;
            b = "";
            "" === g[0] && (b = ":");
            for (l = 0; l < f; l++) {
                b += g[l];
                if (l === f - 1)break;
                b += ":"
            }
            "" === g[f - 1] && (b += ":");
            return b
        }, noConflict: function () {
            f.IPv6 === this && (f.IPv6 = h);
            return this
        }
    }
});
(function (f) {
    function h(b) {
        throw RangeError(e[b]);
    }

    function g(b, e) {
        for (var f = b.length; f--;)b[f] = e(b[f]);
        return b
    }

    function t(b, e) {
        return g(b.split(F), e).join(".")
    }

    function b(b) {
        for (var e = [], f = 0, k = b.length, g, a; f < k;)g = b.charCodeAt(f++), 55296 <= g && 56319 >= g && f < k ? (a = b.charCodeAt(f++), 56320 == (a & 64512) ? e.push(((g & 1023) << 10) + (a & 1023) + 65536) : (e.push(g), f--)) : e.push(g);
        return e
    }

    function l(b) {
        return g(b, function (b) {
            var e = "";
            65535 < b && (b -= 65536, e += B(b >>> 10 & 1023 | 55296), b = 56320 | b & 1023);
            return e += B(b)
        }).join("")
    }

    function z(b,
               e) {
        return b + 22 + 75 * (26 > b) - ((0 != e) << 5)
    }

    function n(b, e, f) {
        var k = 0;
        b = f ? w(b / 700) : b >> 1;
        for (b += w(b / e); 455 < b; k += 36)b = w(b / 35);
        return w(k + 36 * b / (b + 38))
    }

    function u(b) {
        var e = [], f = b.length, k, g = 0, a = 128, c = 72, d, m, x, y, u;
        d = b.lastIndexOf("-");
        0 > d && (d = 0);
        for (m = 0; m < d; ++m)128 <= b.charCodeAt(m) && h("not-basic"), e.push(b.charCodeAt(m));
        for (d = 0 < d ? d + 1 : 0; d < f;) {
            m = g;
            k = 1;
            for (x = 36; ; x += 36) {
                d >= f && h("invalid-input");
                y = b.charCodeAt(d++);
                y = 10 > y - 48 ? y - 22 : 26 > y - 65 ? y - 65 : 26 > y - 97 ? y - 97 : 36;
                (36 <= y || y > w((2147483647 - g) / k)) && h("overflow");
                g += y * k;
                u =
                    x <= c ? 1 : x >= c + 26 ? 26 : x - c;
                if (y < u)break;
                y = 36 - u;
                k > w(2147483647 / y) && h("overflow");
                k *= y
            }
            k = e.length + 1;
            c = n(g - m, k, 0 == m);
            w(g / k) > 2147483647 - a && h("overflow");
            a += w(g / k);
            g %= k;
            e.splice(g++, 0, a)
        }
        return l(e)
    }

    function A(e) {
        var f, k, g, u, a, c, d, m, x, y = [], q, r, A;
        e = b(e);
        q = e.length;
        f = 128;
        k = 0;
        a = 72;
        for (c = 0; c < q; ++c)x = e[c], 128 > x && y.push(B(x));
        for ((g = u = y.length) && y.push("-"); g < q;) {
            d = 2147483647;
            for (c = 0; c < q; ++c)x = e[c], x >= f && x < d && (d = x);
            r = g + 1;
            d - f > w((2147483647 - k) / r) && h("overflow");
            k += (d - f) * r;
            f = d;
            for (c = 0; c < q; ++c)if (x = e[c], x < f && 2147483647 < ++k && h("overflow"), x == f) {
                m = k;
                for (d = 36; ; d += 36) {
                    x = d <= a ? 1 : d >= a + 26 ? 26 : d - a;
                    if (m < x)break;
                    A = m - x;
                    m = 36 - x;
                    y.push(B(z(x + A % m, 0)));
                    m = w(A / m)
                }
                y.push(B(z(m, 0)));
                a = n(k, r, g == u);
                k = 0;
                ++g
            }
            ++k;
            ++f
        }
        return y.join("")
    }

    var D = "object" == typeof exports && exports, k = "object" == typeof module && module && module.exports == D && module, q = "object" == typeof global && global;
    if (q.global === q || q.window === q)f = q;
    var r, v = /^xn--/, p = /[^ -~]/, F = /\x2E|\u3002|\uFF0E|\uFF61/g, e = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
    }, w = Math.floor, B = String.fromCharCode, C;
    r = {
        version: "1.2.3", ucs2: {decode: b, encode: l}, decode: u, encode: A, toASCII: function (b) {
            return t(b, function (b) {
                return p.test(b) ? "xn--" + A(b) : b
            })
        }, toUnicode: function (b) {
            return t(b, function (b) {
                return v.test(b) ? u(b.slice(4).toLowerCase()) : b
            })
        }
    };
    if ("function" == typeof define && "object" == typeof define.amd && define.amd)define(function () {
        return r
    }); else if (D && !D.nodeType)if (k)k.exports = r; else for (C in r)r.hasOwnProperty(C) && (D[C] = r[C]); else f.punycode =
        r
})(this);
(function (f, h) {
    "object" === typeof exports ? module.exports = h() : "function" === typeof define && define.amd ? define(h) : f.SecondLevelDomains = h(f)
})(this, function (f) {
    var h = f && f.SecondLevelDomains, g = {
        list: {
            ac: " com gov mil net org ",
            ae: " ac co gov mil name net org pro sch ",
            af: " com edu gov net org ",
            al: " com edu gov mil net org ",
            ao: " co ed gv it og pb ",
            ar: " com edu gob gov int mil net org tur ",
            at: " ac co gv or ",
            au: " asn com csiro edu gov id net org ",
            ba: " co com edu gov mil net org rs unbi unmo unsa untz unze ",
            bb: " biz co com edu gov info net org store tv ",
            bh: " biz cc com edu gov info net org ",
            bn: " com edu gov net org ",
            bo: " com edu gob gov int mil net org tv ",
            br: " adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ",
            bs: " com edu gov net org ",
            bz: " du et om ov rg ",
            ca: " ab bc mb nb nf nl ns nt nu on pe qc sk yk ",
            ck: " biz co edu gen gov info net org ",
            cn: " ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ",
            co: " com edu gov mil net nom org ",
            cr: " ac c co ed fi go or sa ",
            cy: " ac biz com ekloges gov ltd name net org parliament press pro tm ",
            "do": " art com edu gob gov mil net org sld web ",
            dz: " art asso com edu gov net org pol ",
            ec: " com edu fin gov info med mil net org pro ",
            eg: " com edu eun gov mil name net org sci ",
            er: " com edu gov ind mil net org rochest w ",
            es: " com edu gob nom org ",
            et: " biz com edu gov info name net org ",
            fj: " ac biz com info mil name net org pro ",
            fk: " ac co gov net nom org ",
            fr: " asso com f gouv nom prd presse tm ",
            gg: " co net org ",
            gh: " com edu gov mil org ",
            gn: " ac com gov net org ",
            gr: " com edu gov mil net org ",
            gt: " com edu gob ind mil net org ",
            gu: " com edu gov net org ",
            hk: " com edu gov idv net org ",
            hu: " 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ",
            id: " ac co go mil net or sch web ",
            il: " ac co gov idf k12 muni net org ",
            "in": " ac co edu ernet firm gen gov i ind mil net nic org res ",
            iq: " com edu gov i mil net org ",
            ir: " ac co dnssec gov i id net org sch ",
            it: " edu gov ",
            je: " co net org ",
            jo: " com edu gov mil name net org sch ",
            jp: " ac ad co ed go gr lg ne or ",
            ke: " ac co go info me mobi ne or sc ",
            kh: " com edu gov mil net org per ",
            ki: " biz com de edu gov info mob net org tel ",
            km: " asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ",
            kn: " edu gov net org ",
            kr: " ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ",
            kw: " com edu gov net org ",
            ky: " com edu gov net org ",
            kz: " com edu gov mil net org ",
            lb: " com edu gov net org ",
            lk: " assn com edu gov grp hotel int ltd net ngo org sch soc web ",
            lr: " com edu gov net org ",
            lv: " asn com conf edu gov id mil net org ",
            ly: " com edu gov id med net org plc sch ",
            ma: " ac co gov m net org press ",
            mc: " asso tm ",
            me: " ac co edu gov its net org priv ",
            mg: " com edu gov mil nom org prd tm ",
            mk: " com edu gov inf name net org pro ",
            ml: " com edu gov net org presse ",
            mn: " edu gov org ",
            mo: " com edu gov net org ",
            mt: " com edu gov net org ",
            mv: " aero biz com coop edu gov info int mil museum name net org pro ",
            mw: " ac co com coop edu gov int museum net org ",
            mx: " com edu gob net org ",
            my: " com edu gov mil name net org sch ",
            nf: " arts com firm info net other per rec store web ",
            ng: " biz com edu gov mil mobi name net org sch ",
            ni: " ac co com edu gob mil net nom org ",
            np: " com edu gov mil net org ",
            nr: " biz com edu gov info net org ",
            om: " ac biz co com edu gov med mil museum net org pro sch ",
            pe: " com edu gob mil net nom org sld ",
            ph: " com edu gov i mil net ngo org ",
            pk: " biz com edu fam gob gok gon gop gos gov net org web ",
            pl: " art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ",
            pr: " ac biz com edu est gov info isla name net org pro prof ",
            ps: " com edu gov net org plo sec ",
            pw: " belau co ed go ne or ",
            ro: " arts com firm info nom nt org rec store tm www ",
            rs: " ac co edu gov in org ",
            sb: " com edu gov net org ",
            sc: " com edu gov net org ",
            sh: " co com edu gov net nom org ",
            sl: " com edu gov net org ",
            st: " co com consulado edu embaixada gov mil net org principe saotome store ",
            sv: " com edu gob org red ",
            sz: " ac co org ",
            tr: " av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ",
            tt: " aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ",
            tw: " club com ebiz edu game gov idv mil net org ",
            mu: " ac co com gov net or org ",
            mz: " ac co edu gov org ",
            na: " co com ",
            nz: " ac co cri geek gen govt health iwi maori mil net org parliament school ",
            pa: " abo ac com edu gob ing med net nom org sld ",
            pt: " com edu gov int net nome org publ ",
            py: " com edu gov mil net org ",
            qa: " com edu gov mil net org ",
            re: " asso com nom ",
            ru: " ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ",
            rw: " ac co com edu gouv gov int mil net ",
            sa: " com edu gov med net org pub sch ",
            sd: " com edu gov info med net org tv ",
            se: " a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ",
            sg: " com edu gov idn net org per ",
            sn: " art com edu gouv org perso univ ",
            sy: " com edu gov mil net news org ",
            th: " ac co go in mi net or ",
            tj: " ac biz co com edu go gov info int mil name net nic org test web ",
            tn: " agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ",
            tz: " ac co go ne or ",
            ua: " biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ",
            ug: " ac co go ne or org sc ",
            uk: " ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ",
            us: " dni fed isa kids nsn ",
            uy: " com edu gub mil net org ",
            ve: " co com edu gob info mil net org web ",
            vi: " co com k12 net org ",
            vn: " ac biz com edu gov health info int name net org pro ",
            ye: " co com gov ltd me net org plc ",
            yu: " ac co edu gov org ",
            za: " ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ",
            zm: " ac co com edu gov net org sch "
        }, has: function (f) {
            var b = f.lastIndexOf(".");
            if (0 >= b || b >= f.length - 1)return !1;
            var h = f.lastIndexOf(".", b - 1);
            if (0 >= h || h >= b - 1)return !1;
            var z = g.list[f.slice(b + 1)];
            return z ? 0 <= z.indexOf(" " + f.slice(h + 1, b) + " ") : !1
        }, is: function (f) {
            var b = f.lastIndexOf(".");
            if (0 >= b || b >= f.length - 1 || 0 <= f.lastIndexOf(".", b - 1))return !1;
            var h = g.list[f.slice(b + 1)];
            return h ? 0 <= h.indexOf(" " + f.slice(0, b) + " ") : !1
        }, get: function (f) {
            var b = f.lastIndexOf(".");
            if (0 >= b || b >= f.length - 1)return null;
            var h = f.lastIndexOf(".", b - 1);
            if (0 >= h || h >= b - 1)return null;
            var z = g.list[f.slice(b + 1)];
            return !z || 0 > z.indexOf(" " + f.slice(h +
                    1, b) + " ") ? null : f.slice(h + 1)
        }, noConflict: function () {
            f.SecondLevelDomains === this && (f.SecondLevelDomains = h);
            return this
        }
    };
    return g
});
(function (f, h) {
    "object" === typeof exports ? module.exports = h(require("./punycode"), require("./IPv6"), require("./SecondLevelDomains")) : "function" === typeof define && define.amd ? define(["./punycode", "./IPv6", "./SecondLevelDomains"], h) : f.URI = h(f.punycode, f.IPv6, f.SecondLevelDomains, f)
})(this, function (f, h, g, t) {
    function b(a, c) {
        var d = 1 <= arguments.length, m = 2 <= arguments.length;
        if (!(this instanceof b))return d ? m ? new b(a, c) : new b(a) : new b;
        if (void 0 === a) {
            if (d)throw new TypeError("undefined is not a valid argument for URI");
            a = "undefined" !== typeof location ? location.href + "" : ""
        }
        this.href(a);
        return void 0 !== c ? this.absoluteTo(c) : this
    }

    function l(a) {
        return a.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
    }

    function z(a) {
        return void 0 === a ? "Undefined" : String(Object.prototype.toString.call(a)).slice(8, -1)
    }

    function n(a) {
        return "Array" === z(a)
    }

    function u(a, c) {
        var d = {}, b, f;
        if ("RegExp" === z(c))d = null; else if (n(c))for (b = 0, f = c.length; b < f; b++)d[c[b]] = !0; else d[c] = !0;
        b = 0;
        for (f = a.length; b < f; b++)if (d && void 0 !== d[a[b]] || !d && c.test(a[b]))a.splice(b,
            1), f--, b--;
        return a
    }

    function A(a, c) {
        var d, b;
        if (n(c)) {
            d = 0;
            for (b = c.length; d < b; d++)if (!A(a, c[d]))return !1;
            return !0
        }
        var f = z(c);
        d = 0;
        for (b = a.length; d < b; d++)if ("RegExp" === f) {
            if ("string" === typeof a[d] && a[d].match(c))return !0
        } else if (a[d] === c)return !0;
        return !1
    }

    function D(a, c) {
        if (!n(a) || !n(c) || a.length !== c.length)return !1;
        a.sort();
        c.sort();
        for (var d = 0, b = a.length; d < b; d++)if (a[d] !== c[d])return !1;
        return !0
    }

    function k(a) {
        return a.replace(/^\/+|\/+$/g, "")
    }

    function q(a) {
        return escape(a)
    }

    function r(a) {
        return encodeURIComponent(a).replace(/[!'()*]/g,
            q).replace(/\*/g, "%2A")
    }

    function v(a) {
        return function (c, d) {
            if (void 0 === c)return this._parts[a] || "";
            this._parts[a] = c || null;
            this.build(!d);
            return this
        }
    }

    function p(a, c) {
        return function (d, b) {
            if (void 0 === d)return this._parts[a] || "";
            null !== d && (d += "", d.charAt(0) === c && (d = d.substring(1)));
            this._parts[a] = d;
            this.build(!b);
            return this
        }
    }

    var F = t && t.URI;
    b.version = "1.17.0";
    var e = b.prototype, w = Object.prototype.hasOwnProperty;
    b._parts = function () {
        return {
            protocol: null,
            username: null,
            password: null,
            hostname: null,
            urn: null,
            port: null,
            path: null,
            query: null,
            fragment: null,
            duplicateQueryParameters: b.duplicateQueryParameters,
            escapeQuerySpace: b.escapeQuerySpace
        }
    };
    b.duplicateQueryParameters = !1;
    b.escapeQuerySpace = !0;
    b.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
    b.idn_expression = /[^a-z0-9\.-]/i;
    b.punycode_expression = /(xn--)/i;
    b.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    b.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    b.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u2018\u2019]))/ig;
    b.findUri = {
        start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
        end: /[\s\r\n]|$/,
        trim: /[`!()\[\]{};:'".,<>?\u00ab\u00bb\u201c\u201d\u201e\u2018\u2019]+$/
    };
    b.defaultPorts = {http: "80", https: "443", ftp: "21", gopher: "70", ws: "80", wss: "443"};
    b.invalid_hostname_characters =
        /[^a-zA-Z0-9\.-]/;
    b.domAttributes = {
        a: "href",
        blockquote: "cite",
        link: "href",
        base: "href",
        script: "src",
        form: "action",
        img: "src",
        area: "href",
        iframe: "src",
        embed: "src",
        source: "src",
        track: "src",
        input: "src",
        audio: "src",
        video: "src"
    };
    b.getDomAttribute = function (a) {
        if (a && a.nodeName) {
            var c = a.nodeName.toLowerCase();
            return "input" === c && "image" !== a.type ? void 0 : b.domAttributes[c]
        }
    };
    b.encode = r;
    b.decode = decodeURIComponent;
    b.iso8859 = function () {
        b.encode = escape;
        b.decode = unescape
    };
    b.unicode = function () {
        b.encode = r;
        b.decode =
            decodeURIComponent
    };
    b.characters = {
        pathname: {
            encode: {
                expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
                map: {"%24": "$", "%26": "&", "%2B": "+", "%2C": ",", "%3B": ";", "%3D": "=", "%3A": ":", "%40": "@"}
            }, decode: {expression: /[\/\?#]/g, map: {"/": "%2F", "?": "%3F", "#": "%23"}}
        },
        reserved: {
            encode: {
                expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig, map: {
                    "%3A": ":",
                    "%2F": "/",
                    "%3F": "?",
                    "%23": "#",
                    "%5B": "[",
                    "%5D": "]",
                    "%40": "@",
                    "%21": "!",
                    "%24": "$",
                    "%26": "&",
                    "%27": "'",
                    "%28": "(",
                    "%29": ")",
                    "%2A": "*",
                    "%2B": "+",
                    "%2C": ",",
                    "%3B": ";",
                    "%3D": "="
                }
            }
        },
        urnpath: {
            encode: {
                expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
                map: {
                    "%21": "!",
                    "%24": "$",
                    "%27": "'",
                    "%28": "(",
                    "%29": ")",
                    "%2A": "*",
                    "%2B": "+",
                    "%2C": ",",
                    "%3B": ";",
                    "%3D": "=",
                    "%40": "@"
                }
            }, decode: {expression: /[\/\?#:]/g, map: {"/": "%2F", "?": "%3F", "#": "%23", ":": "%3A"}}
        }
    };
    b.encodeQuery = function (a, c) {
        var d = b.encode(a + "");
        void 0 === c && (c = b.escapeQuerySpace);
        return c ? d.replace(/%20/g, "+") : d
    };
    b.decodeQuery = function (a, c) {
        a += "";
        void 0 === c && (c = b.escapeQuerySpace);
        try {
            return b.decode(c ? a.replace(/\+/g,
                "%20") : a)
        } catch (d) {
            return a
        }
    };
    var B = {encode: "encode", decode: "decode"}, C, E = function (a, c) {
        return function (d) {
            try {
                return b[c](d + "").replace(b.characters[a][c].expression, function (d) {
                    return b.characters[a][c].map[d]
                })
            } catch (m) {
                return d
            }
        }
    };
    for (C in B)b[C + "PathSegment"] = E("pathname", B[C]), b[C + "UrnPathSegment"] = E("urnpath", B[C]);
    B = function (a, c, d) {
        return function (m) {
            var f;
            f = d ? function (a) {
                return b[c](b[d](a))
            } : b[c];
            m = (m + "").split(a);
            for (var e = 0, k = m.length; e < k; e++)m[e] = f(m[e]);
            return m.join(a)
        }
    };
    b.decodePath =
        B("/", "decodePathSegment");
    b.decodeUrnPath = B(":", "decodeUrnPathSegment");
    b.recodePath = B("/", "encodePathSegment", "decode");
    b.recodeUrnPath = B(":", "encodeUrnPathSegment", "decode");
    b.encodeReserved = E("reserved", "encode");
    b.parse = function (a, c) {
        var d;
        c || (c = {});
        d = a.indexOf("#");
        -1 < d && (c.fragment = a.substring(d + 1) || null, a = a.substring(0, d));
        d = a.indexOf("?");
        -1 < d && (c.query = a.substring(d + 1) || null, a = a.substring(0, d));
        "//" === a.substring(0, 2) ? (c.protocol = null, a = a.substring(2), a = b.parseAuthority(a, c)) : (d = a.indexOf(":"),
        -1 < d && (c.protocol = a.substring(0, d) || null, c.protocol && !c.protocol.match(b.protocol_expression) ? c.protocol = void 0 : "//" === a.substring(d + 1, d + 3) ? (a = a.substring(d + 3), a = b.parseAuthority(a, c)) : (a = a.substring(d + 1), c.urn = !0)));
        c.path = a;
        return c
    };
    b.parseHost = function (a, c) {
        a = a.replace(/\\/g, "/");
        var d = a.indexOf("/"), b;
        -1 === d && (d = a.length);
        if ("[" === a.charAt(0))b = a.indexOf("]"), c.hostname = a.substring(1, b) || null, c.port = a.substring(b + 2, d) || null, "/" === c.port && (c.port = null); else {
            var f = a.indexOf(":");
            b = a.indexOf("/");
            f = a.indexOf(":", f + 1);
            -1 !== f && (-1 === b || f < b) ? (c.hostname = a.substring(0, d) || null, c.port = null) : (b = a.substring(0, d).split(":"), c.hostname = b[0] || null, c.port = b[1] || null)
        }
        c.hostname && "/" !== a.substring(d).charAt(0) && (d++, a = "/" + a);
        return a.substring(d) || "/"
    };
    b.parseAuthority = function (a, c) {
        a = b.parseUserinfo(a, c);
        return b.parseHost(a, c)
    };
    b.parseUserinfo = function (a, c) {
        var d = a.indexOf("/"), m = a.lastIndexOf("@", -1 < d ? d : a.length - 1);
        -1 < m && (-1 === d || m < d) ? (d = a.substring(0, m).split(":"), c.username = d[0] ? b.decode(d[0]) : null,
            d.shift(), c.password = d[0] ? b.decode(d.join(":")) : null, a = a.substring(m + 1)) : (c.username = null, c.password = null);
        return a
    };
    b.parseQuery = function (a, c) {
        if (!a)return {};
        a = a.replace(/&+/g, "&").replace(/^\?*&*|&+$/g, "");
        if (!a)return {};
        for (var d = {}, m = a.split("&"), f = m.length, e, k, g = 0; g < f; g++)if (e = m[g].split("="), k = b.decodeQuery(e.shift(), c), e = e.length ? b.decodeQuery(e.join("="), c) : null, w.call(d, k)) {
            if ("string" === typeof d[k] || null === d[k])d[k] = [d[k]];
            d[k].push(e)
        } else d[k] = e;
        return d
    };
    b.build = function (a) {
        var c = "";
        a.protocol && (c += a.protocol + ":");
        a.urn || !c && !a.hostname || (c += "//");
        c += b.buildAuthority(a) || "";
        "string" === typeof a.path && ("/" !== a.path.charAt(0) && "string" === typeof a.hostname && (c += "/"), c += a.path);
        "string" === typeof a.query && a.query && (c += "?" + a.query);
        "string" === typeof a.fragment && a.fragment && (c += "#" + a.fragment);
        return c
    };
    b.buildHost = function (a) {
        var c = "";
        if (a.hostname)c = b.ip6_expression.test(a.hostname) ? c + ("[" + a.hostname + "]") : c + a.hostname; else return "";
        a.port && (c += ":" + a.port);
        return c
    };
    b.buildAuthority =
        function (a) {
            return b.buildUserinfo(a) + b.buildHost(a)
        };
    b.buildUserinfo = function (a) {
        var c = "";
        a.username && (c += b.encode(a.username), a.password && (c += ":" + b.encode(a.password)), c += "@");
        return c
    };
    b.buildQuery = function (a, c, d) {
        var m = "", f, e, k, g;
        for (e in a)if (w.call(a, e) && e)if (n(a[e]))for (f = {}, k = 0, g = a[e].length; k < g; k++)void 0 !== a[e][k] && void 0 === f[a[e][k] + ""] && (m += "&" + b.buildQueryParameter(e, a[e][k], d), !0 !== c && (f[a[e][k] + ""] = !0)); else void 0 !== a[e] && (m += "&" + b.buildQueryParameter(e, a[e], d));
        return m.substring(1)
    };
    b.buildQueryParameter = function (a, c, d) {
        return b.encodeQuery(a, d) + (null !== c ? "=" + b.encodeQuery(c, d) : "")
    };
    b.addQuery = function (a, c, d) {
        if ("object" === typeof c)for (var m in c)w.call(c, m) && b.addQuery(a, m, c[m]); else if ("string" === typeof c)void 0 === a[c] ? a[c] = d : ("string" === typeof a[c] && (a[c] = [a[c]]), n(d) || (d = [d]), a[c] = (a[c] || []).concat(d)); else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
    };
    b.removeQuery = function (a, c, d) {
        var m;
        if (n(c))for (d = 0, m = c.length; d < m; d++)a[c[d]] = void 0; else if ("RegExp" === z(c))for (m in a)c.test(m) && (a[m] = void 0); else if ("object" === typeof c)for (m in c)w.call(c, m) && b.removeQuery(a, m, c[m]); else if ("string" === typeof c)void 0 !== d ? "RegExp" === z(d) ? !n(a[c]) && d.test(a[c]) ? a[c] = void 0 : a[c] = u(a[c], d) : a[c] !== String(d) || n(d) && 1 !== d.length ? n(a[c]) && (a[c] = u(a[c], d)) : a[c] = void 0 : a[c] = void 0; else throw new TypeError("URI.removeQuery() accepts an object, string, RegExp as the first parameter");
    };
    b.hasQuery = function (a, c, d, m) {
        if ("object" === typeof c) {
            for (var e in c)if (w.call(c,
                    e) && !b.hasQuery(a, e, c[e]))return !1;
            return !0
        }
        if ("string" !== typeof c)throw new TypeError("URI.hasQuery() accepts an object, string as the name parameter");
        switch (z(d)) {
            case "Undefined":
                return c in a;
            case "Boolean":
                return a = Boolean(n(a[c]) ? a[c].length : a[c]), d === a;
            case "Function":
                return !!d(a[c], c, a);
            case "Array":
                return n(a[c]) ? (m ? A : D)(a[c], d) : !1;
            case "RegExp":
                return n(a[c]) ? m ? A(a[c], d) : !1 : Boolean(a[c] && a[c].match(d));
            case "Number":
                d = String(d);
            case "String":
                return n(a[c]) ? m ? A(a[c], d) : !1 : a[c] === d;
            default:
                throw new TypeError("URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter");
        }
    };
    b.commonPath = function (a, c) {
        var d = Math.min(a.length, c.length), b;
        for (b = 0; b < d; b++)if (a.charAt(b) !== c.charAt(b)) {
            b--;
            break
        }
        if (1 > b)return a.charAt(0) === c.charAt(0) && "/" === a.charAt(0) ? "/" : "";
        if ("/" !== a.charAt(b) || "/" !== c.charAt(b))b = a.substring(0, b).lastIndexOf("/");
        return a.substring(0, b + 1)
    };
    b.withinString = function (a, c, d) {
        d || (d = {});
        var e = d.start || b.findUri.start, f = d.end || b.findUri.end, k = d.trim || b.findUri.trim, g = /[a-z0-9-]=["']?$/i;
        for (e.lastIndex = 0; ;) {
            var u = e.exec(a);
            if (!u)break;
            u = u.index;
            if (d.ignoreHtml) {
                var q =
                    a.slice(Math.max(u - 3, 0), u);
                if (q && g.test(q))continue
            }
            var q = u + a.slice(u).search(f), h = a.slice(u, q).replace(k, "");
            d.ignore && d.ignore.test(h) || (q = u + h.length, h = c(h, u, q, a), a = a.slice(0, u) + h + a.slice(q), e.lastIndex = u + h.length)
        }
        e.lastIndex = 0;
        return a
    };
    b.ensureValidHostname = function (a) {
        if (a.match(b.invalid_hostname_characters)) {
            if (!f)throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
            if (f.toASCII(a).match(b.invalid_hostname_characters))throw new TypeError('Hostname "' +
                a + '" contains characters other than [A-Z0-9.-]');
        }
    };
    b.noConflict = function (a) {
        if (a)return a = {URI: this.noConflict()}, t.URITemplate && "function" === typeof t.URITemplate.noConflict && (a.URITemplate = t.URITemplate.noConflict()), t.IPv6 && "function" === typeof t.IPv6.noConflict && (a.IPv6 = t.IPv6.noConflict()), t.SecondLevelDomains && "function" === typeof t.SecondLevelDomains.noConflict && (a.SecondLevelDomains = t.SecondLevelDomains.noConflict()), a;
        t.URI === this && (t.URI = F);
        return this
    };
    e.build = function (a) {
        if (!0 === a)this._deferred_build = !0; else if (void 0 === a || this._deferred_build)this._string = b.build(this._parts), this._deferred_build = !1;
        return this
    };
    e.clone = function () {
        return new b(this)
    };
    e.valueOf = e.toString = function () {
        return this.build(!1)._string
    };
    e.protocol = v("protocol");
    e.username = v("username");
    e.password = v("password");
    e.hostname = v("hostname");
    e.port = v("port");
    e.query = p("query", "?");
    e.fragment = p("fragment", "#");
    e.search = function (a, c) {
        var d = this.query(a, c);
        return "string" === typeof d && d.length ? "?" + d : d
    };
    e.hash = function (a, c) {
        var d =
            this.fragment(a, c);
        return "string" === typeof d && d.length ? "#" + d : d
    };
    e.pathname = function (a, c) {
        if (void 0 === a || !0 === a) {
            var d = this._parts.path || (this._parts.hostname ? "/" : "");
            return a ? (this._parts.urn ? b.decodeUrnPath : b.decodePath)(d) : d
        }
        this._parts.path = this._parts.urn ? a ? b.recodeUrnPath(a) : "" : a ? b.recodePath(a) : "/";
        this.build(!c);
        return this
    };
    e.path = e.pathname;
    e.href = function (a, c) {
        var d;
        if (void 0 === a)return this.toString();
        this._string = "";
        this._parts = b._parts();
        var e = a instanceof b, f = "object" === typeof a && (a.hostname ||
            a.path || a.pathname);
        a.nodeName && (f = b.getDomAttribute(a), a = a[f] || "", f = !1);
        !e && f && void 0 !== a.pathname && (a = a.toString());
        if ("string" === typeof a || a instanceof String)this._parts = b.parse(String(a), this._parts); else if (e || f)for (d in e = e ? a._parts : a, e)w.call(this._parts, d) && (this._parts[d] = e[d]); else throw new TypeError("invalid input");
        this.build(!c);
        return this
    };
    e.is = function (a) {
        var c = !1, d = !1, e = !1, f = !1, k = !1, u = !1, q = !1, h = !this._parts.urn;
        this._parts.hostname && (h = !1, d = b.ip4_expression.test(this._parts.hostname),
            e = b.ip6_expression.test(this._parts.hostname), c = d || e, k = (f = !c) && g && g.has(this._parts.hostname), u = f && b.idn_expression.test(this._parts.hostname), q = f && b.punycode_expression.test(this._parts.hostname));
        switch (a.toLowerCase()) {
            case "relative":
                return h;
            case "absolute":
                return !h;
            case "domain":
            case "name":
                return f;
            case "sld":
                return k;
            case "ip":
                return c;
            case "ip4":
            case "ipv4":
            case "inet4":
                return d;
            case "ip6":
            case "ipv6":
            case "inet6":
                return e;
            case "idn":
                return u;
            case "url":
                return !this._parts.urn;
            case "urn":
                return !!this._parts.urn;
            case "punycode":
                return q
        }
        return null
    };
    var G = e.protocol, H = e.port, I = e.hostname;
    e.protocol = function (a, c) {
        if (void 0 !== a && a && (a = a.replace(/:(\/\/)?$/, ""), !a.match(b.protocol_expression)))throw new TypeError('Protocol "' + a + "\" contains characters other than [A-Z0-9.+-] or doesn't start with [A-Z]");
        return G.call(this, a, c)
    };
    e.scheme = e.protocol;
    e.port = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 !== a && (0 === a && (a = null), a && (a += "", ":" === a.charAt(0) && (a = a.substring(1)), a.match(/[^0-9]/))))throw new TypeError('Port "' +
            a + '" contains characters other than [0-9]');
        return H.call(this, a, c)
    };
    e.hostname = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 !== a) {
            var d = {};
            if ("/" !== b.parseHost(a, d))throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-]');
            a = d.hostname
        }
        return I.call(this, a, c)
    };
    e.origin = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a) {
            var d = this.protocol();
            return this.authority() ? (d ? d + "://" : "") + this.authority() : ""
        }
        d = b(a);
        this.protocol(d.protocol()).authority(d.authority()).build(!c);
        return this
    };
    e.host = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a)return this._parts.hostname ? b.buildHost(this._parts) : "";
        if ("/" !== b.parseHost(a, this._parts))throw new TypeError('Hostname "' + a + '" contains characters other than [A-Z0-9.-]');
        this.build(!c);
        return this
    };
    e.authority = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a)return this._parts.hostname ? b.buildAuthority(this._parts) : "";
        if ("/" !== b.parseAuthority(a, this._parts))throw new TypeError('Hostname "' +
            a + '" contains characters other than [A-Z0-9.-]');
        this.build(!c);
        return this
    };
    e.userinfo = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a) {
            if (!this._parts.username)return "";
            var d = b.buildUserinfo(this._parts);
            return d.substring(0, d.length - 1)
        }
        "@" !== a[a.length - 1] && (a += "@");
        b.parseUserinfo(a, this._parts);
        this.build(!c);
        return this
    };
    e.resource = function (a, c) {
        var d;
        if (void 0 === a)return this.path() + this.search() + this.hash();
        d = b.parse(a);
        this._parts.path = d.path;
        this._parts.query = d.query;
        this._parts.fragment = d.fragment;
        this.build(!c);
        return this
    };
    e.subdomain = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a) {
            if (!this._parts.hostname || this.is("IP"))return "";
            var d = this._parts.hostname.length - this.domain().length - 1;
            return this._parts.hostname.substring(0, d) || ""
        }
        d = this._parts.hostname.length - this.domain().length;
        d = this._parts.hostname.substring(0, d);
        d = new RegExp("^" + l(d));
        a && "." !== a.charAt(a.length - 1) && (a += ".");
        a && b.ensureValidHostname(a);
        this._parts.hostname = this._parts.hostname.replace(d,
            a);
        this.build(!c);
        return this
    };
    e.domain = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        "boolean" === typeof a && (c = a, a = void 0);
        if (void 0 === a) {
            if (!this._parts.hostname || this.is("IP"))return "";
            var d = this._parts.hostname.match(/\./g);
            if (d && 2 > d.length)return this._parts.hostname;
            d = this._parts.hostname.length - this.tld(c).length - 1;
            d = this._parts.hostname.lastIndexOf(".", d - 1) + 1;
            return this._parts.hostname.substring(d) || ""
        }
        if (!a)throw new TypeError("cannot set domain empty");
        b.ensureValidHostname(a);
        !this._parts.hostname || this.is("IP") ? this._parts.hostname = a : (d = new RegExp(l(this.domain()) + "$"), this._parts.hostname = this._parts.hostname.replace(d, a));
        this.build(!c);
        return this
    };
    e.tld = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        "boolean" === typeof a && (c = a, a = void 0);
        if (void 0 === a) {
            if (!this._parts.hostname || this.is("IP"))return "";
            var d = this._parts.hostname.lastIndexOf("."), d = this._parts.hostname.substring(d + 1);
            return !0 !== c && g && g.list[d.toLowerCase()] ? g.get(this._parts.hostname) || d : d
        }
        if (a)if (a.match(/[^a-zA-Z0-9-]/))if (g &&
            g.is(a))d = new RegExp(l(this.tld()) + "$"), this._parts.hostname = this._parts.hostname.replace(d, a); else throw new TypeError('TLD "' + a + '" contains characters other than [A-Z0-9]'); else {
            if (!this._parts.hostname || this.is("IP"))throw new ReferenceError("cannot set TLD on non-domain host");
            d = new RegExp(l(this.tld()) + "$");
            this._parts.hostname = this._parts.hostname.replace(d, a)
        } else throw new TypeError("cannot set TLD empty");
        this.build(!c);
        return this
    };
    e.directory = function (a, c) {
        if (this._parts.urn)return void 0 ===
        a ? "" : this;
        if (void 0 === a || !0 === a) {
            if (!this._parts.path && !this._parts.hostname)return "";
            if ("/" === this._parts.path)return "/";
            var d = this._parts.path.length - this.filename().length - 1, d = this._parts.path.substring(0, d) || (this._parts.hostname ? "/" : "");
            return a ? b.decodePath(d) : d
        }
        d = this._parts.path.length - this.filename().length;
        d = this._parts.path.substring(0, d);
        d = new RegExp("^" + l(d));
        this.is("relative") || (a || (a = "/"), "/" !== a.charAt(0) && (a = "/" + a));
        a && "/" !== a.charAt(a.length - 1) && (a += "/");
        a = b.recodePath(a);
        this._parts.path =
            this._parts.path.replace(d, a);
        this.build(!c);
        return this
    };
    e.filename = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a || !0 === a) {
            if (!this._parts.path || "/" === this._parts.path)return "";
            var d = this._parts.path.lastIndexOf("/"), d = this._parts.path.substring(d + 1);
            return a ? b.decodePathSegment(d) : d
        }
        d = !1;
        "/" === a.charAt(0) && (a = a.substring(1));
        a.match(/\.?\//) && (d = !0);
        var e = new RegExp(l(this.filename()) + "$");
        a = b.recodePath(a);
        this._parts.path = this._parts.path.replace(e, a);
        d ? this.normalizePath(c) :
            this.build(!c);
        return this
    };
    e.suffix = function (a, c) {
        if (this._parts.urn)return void 0 === a ? "" : this;
        if (void 0 === a || !0 === a) {
            if (!this._parts.path || "/" === this._parts.path)return "";
            var d = this.filename(), e = d.lastIndexOf(".");
            if (-1 === e)return "";
            d = d.substring(e + 1);
            d = /^[a-z0-9%]+$/i.test(d) ? d : "";
            return a ? b.decodePathSegment(d) : d
        }
        "." === a.charAt(0) && (a = a.substring(1));
        if (d = this.suffix())e = a ? new RegExp(l(d) + "$") : new RegExp(l("." + d) + "$"); else {
            if (!a)return this;
            this._parts.path += "." + b.recodePath(a)
        }
        e && (a = b.recodePath(a),
            this._parts.path = this._parts.path.replace(e, a));
        this.build(!c);
        return this
    };
    e.segment = function (a, c, d) {
        var b = this._parts.urn ? ":" : "/", e = this.path(), f = "/" === e.substring(0, 1), e = e.split(b);
        void 0 !== a && "number" !== typeof a && (d = c, c = a, a = void 0);
        if (void 0 !== a && "number" !== typeof a)throw Error('Bad segment "' + a + '", must be 0-based integer');
        f && e.shift();
        0 > a && (a = Math.max(e.length + a, 0));
        if (void 0 === c)return void 0 === a ? e : e[a];
        if (null === a || void 0 === e[a])if (n(c)) {
            e = [];
            a = 0;
            for (var g = c.length; a < g; a++)if (c[a].length ||
                e.length && e[e.length - 1].length)e.length && !e[e.length - 1].length && e.pop(), e.push(k(c[a]))
        } else {
            if (c || "string" === typeof c)c = k(c), "" === e[e.length - 1] ? e[e.length - 1] = c : e.push(c)
        } else c ? e[a] = k(c) : e.splice(a, 1);
        f && e.unshift("");
        return this.path(e.join(b), d)
    };
    e.segmentCoded = function (a, c, d) {
        var e, f;
        "number" !== typeof a && (d = c, c = a, a = void 0);
        if (void 0 === c) {
            a = this.segment(a, c, d);
            if (n(a))for (e = 0, f = a.length; e < f; e++)a[e] = b.decode(a[e]); else a = void 0 !== a ? b.decode(a) : void 0;
            return a
        }
        if (n(c))for (e = 0, f = c.length; e < f; e++)c[e] =
            b.encode(c[e]); else c = "string" === typeof c || c instanceof String ? b.encode(c) : c;
        return this.segment(a, c, d)
    };
    var J = e.query;
    e.query = function (a, c) {
        if (!0 === a)return b.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        if ("function" === typeof a) {
            var d = b.parseQuery(this._parts.query, this._parts.escapeQuerySpace), e = a.call(this, d);
            this._parts.query = b.buildQuery(e || d, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
            this.build(!c);
            return this
        }
        return void 0 !== a && "string" !== typeof a ? (this._parts.query =
            b.buildQuery(a, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace), this.build(!c), this) : J.call(this, a, c)
    };
    e.setQuery = function (a, c, d) {
        var e = b.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        if ("string" === typeof a || a instanceof String)e[a] = void 0 !== c ? c : null; else if ("object" === typeof a)for (var f in a)w.call(a, f) && (e[f] = a[f]); else throw new TypeError("URI.addQuery() accepts an object, string as the name parameter");
        this._parts.query = b.buildQuery(e, this._parts.duplicateQueryParameters,
            this._parts.escapeQuerySpace);
        "string" !== typeof a && (d = c);
        this.build(!d);
        return this
    };
    e.addQuery = function (a, c, d) {
        var e = b.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        b.addQuery(e, a, void 0 === c ? null : c);
        this._parts.query = b.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        "string" !== typeof a && (d = c);
        this.build(!d);
        return this
    };
    e.removeQuery = function (a, c, d) {
        var e = b.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        b.removeQuery(e, a, c);
        this._parts.query =
            b.buildQuery(e, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        "string" !== typeof a && (d = c);
        this.build(!d);
        return this
    };
    e.hasQuery = function (a, c, d) {
        var e = b.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        return b.hasQuery(e, a, c, d)
    };
    e.setSearch = e.setQuery;
    e.addSearch = e.addQuery;
    e.removeSearch = e.removeQuery;
    e.hasSearch = e.hasQuery;
    e.normalize = function () {
        return this._parts.urn ? this.normalizeProtocol(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build() : this.normalizeProtocol(!1).normalizeHostname(!1).normalizePort(!1).normalizePath(!1).normalizeQuery(!1).normalizeFragment(!1).build()
    };
    e.normalizeProtocol = function (a) {
        "string" === typeof this._parts.protocol && (this._parts.protocol = this._parts.protocol.toLowerCase(), this.build(!a));
        return this
    };
    e.normalizeHostname = function (a) {
        this._parts.hostname && (this.is("IDN") && f ? this._parts.hostname = f.toASCII(this._parts.hostname) : this.is("IPv6") && h && (this._parts.hostname = h.best(this._parts.hostname)), this._parts.hostname = this._parts.hostname.toLowerCase(), this.build(!a));
        return this
    };
    e.normalizePort = function (a) {
        "string" === typeof this._parts.protocol &&
        this._parts.port === b.defaultPorts[this._parts.protocol] && (this._parts.port = null, this.build(!a));
        return this
    };
    e.normalizePath = function (a) {
        var c = this._parts.path;
        if (!c)return this;
        if (this._parts.urn)return this._parts.path = b.recodeUrnPath(this._parts.path), this.build(!a), this;
        if ("/" === this._parts.path)return this;
        var c = b.recodePath(c), d, e = "", f, k;
        "/" !== c.charAt(0) && (d = !0, c = "/" + c);
        if ("/.." === c.slice(-3) || "/." === c.slice(-2))c += "/";
        c = c.replace(/(\/(\.\/)+)|(\/\.$)/g, "/").replace(/\/{2,}/g, "/");
        d && (e = c.substring(1).match(/^(\.\.\/)+/) ||
            "") && (e = e[0]);
        for (; ;) {
            f = c.search(/\/\.\.(\/|$)/);
            if (-1 === f)break; else if (0 === f) {
                c = c.substring(3);
                continue
            }
            k = c.substring(0, f).lastIndexOf("/");
            -1 === k && (k = f);
            c = c.substring(0, k) + c.substring(f + 3)
        }
        d && this.is("relative") && (c = e + c.substring(1));
        this._parts.path = c;
        this.build(!a);
        return this
    };
    e.normalizePathname = e.normalizePath;
    e.normalizeQuery = function (a) {
        "string" === typeof this._parts.query && (this._parts.query.length ? this.query(b.parseQuery(this._parts.query, this._parts.escapeQuerySpace)) : this._parts.query =
            null, this.build(!a));
        return this
    };
    e.normalizeFragment = function (a) {
        this._parts.fragment || (this._parts.fragment = null, this.build(!a));
        return this
    };
    e.normalizeSearch = e.normalizeQuery;
    e.normalizeHash = e.normalizeFragment;
    e.iso8859 = function () {
        var a = b.encode, c = b.decode;
        b.encode = escape;
        b.decode = decodeURIComponent;
        try {
            this.normalize()
        } finally {
            b.encode = a, b.decode = c
        }
        return this
    };
    e.unicode = function () {
        var a = b.encode, c = b.decode;
        b.encode = r;
        b.decode = unescape;
        try {
            this.normalize()
        } finally {
            b.encode = a, b.decode = c
        }
        return this
    };
    e.readable = function () {
        var a = this.clone();
        a.username("").password("").normalize();
        var c = "";
        a._parts.protocol && (c += a._parts.protocol + "://");
        a._parts.hostname && (a.is("punycode") && f ? (c += f.toUnicode(a._parts.hostname), a._parts.port && (c += ":" + a._parts.port)) : c += a.host());
        a._parts.hostname && a._parts.path && "/" !== a._parts.path.charAt(0) && (c += "/");
        c += a.path(!0);
        if (a._parts.query) {
            for (var d = "", e = 0, k = a._parts.query.split("&"), g = k.length; e < g; e++) {
                var u = (k[e] || "").split("="), d = d + ("&" + b.decodeQuery(u[0], this._parts.escapeQuerySpace).replace(/&/g,
                        "%26"));
                void 0 !== u[1] && (d += "=" + b.decodeQuery(u[1], this._parts.escapeQuerySpace).replace(/&/g, "%26"))
            }
            c += "?" + d.substring(1)
        }
        return c += b.decodeQuery(a.hash(), !0)
    };
    e.absoluteTo = function (a) {
        var c = this.clone(), d = ["protocol", "username", "password", "hostname", "port"], e, f;
        if (this._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");
        a instanceof b || (a = new b(a));
        c._parts.protocol || (c._parts.protocol = a._parts.protocol);
        if (this._parts.hostname)return c;
        for (e = 0; f = d[e]; e++)c._parts[f] =
            a._parts[f];
        c._parts.path ? ".." === c._parts.path.substring(-2) && (c._parts.path += "/") : (c._parts.path = a._parts.path, c._parts.query || (c._parts.query = a._parts.query));
        "/" !== c.path().charAt(0) && (d = (d = a.directory()) ? d : 0 === a.path().indexOf("/") ? "/" : "", c._parts.path = (d ? d + "/" : "") + c._parts.path, c.normalizePath());
        c.build();
        return c
    };
    e.relativeTo = function (a) {
        var c = this.clone().normalize(), d, e, f;
        if (c._parts.urn)throw Error("URNs do not have any generally defined hierarchical components");
        a = (new b(a)).normalize();
        d = c._parts;
        e = a._parts;
        f = c.path();
        a = a.path();
        if ("/" !== f.charAt(0))throw Error("URI is already relative");
        if ("/" !== a.charAt(0))throw Error("Cannot calculate a URI relative to another relative URI");
        d.protocol === e.protocol && (d.protocol = null);
        if (d.username === e.username && d.password === e.password && null === d.protocol && null === d.username && null === d.password && d.hostname === e.hostname && d.port === e.port)d.hostname = null, d.port = null; else return c.build();
        if (f === a)return d.path = "", c.build();
        f = b.commonPath(f, a);
        if (!f)return c.build();
        e = e.path.substring(f.length).replace(/[^\/]*$/, "").replace(/.*?\//g, "../");
        d.path = e + d.path.substring(f.length) || "./";
        return c.build()
    };
    e.equals = function (a) {
        var c = this.clone();
        a = new b(a);
        var d = {}, e = {}, f = {}, k;
        c.normalize();
        a.normalize();
        if (c.toString() === a.toString())return !0;
        d = c.query();
        e = a.query();
        c.query("");
        a.query("");
        if (c.toString() !== a.toString() || d.length !== e.length)return !1;
        d = b.parseQuery(d, this._parts.escapeQuerySpace);
        e = b.parseQuery(e, this._parts.escapeQuerySpace);
        for (k in d)if (w.call(d,
                k)) {
            if (!n(d[k])) {
                if (d[k] !== e[k])return !1
            } else if (!D(d[k], e[k]))return !1;
            f[k] = !0
        }
        for (k in e)if (w.call(e, k) && !f[k])return !1;
        return !0
    };
    e.duplicateQueryParameters = function (a) {
        this._parts.duplicateQueryParameters = !!a;
        return this
    };
    e.escapeQuerySpace = function (a) {
        this._parts.escapeQuerySpace = !!a;
        return this
    };
    return b
});
(function (f, h) {
    "object" === typeof exports ? module.exports = h(require("./URI")) : "function" === typeof define && define.amd ? define(["./URI"], h) : f.URITemplate = h(f.URI, f)
})(this, function (f, h) {
    function g(b) {
        if (g._cache[b])return g._cache[b];
        if (!(this instanceof g))return new g(b);
        this.expression = b;
        g._cache[b] = this;
        return this
    }

    function t(b) {
        this.data = b;
        this.cache = {}
    }

    var b = h && h.URITemplate, l = Object.prototype.hasOwnProperty, z = g.prototype, n = {
        "": {prefix: "", separator: ",", named: !1, empty_name_separator: !1, encode: "encode"},
        "+": {prefix: "", separator: ",", named: !1, empty_name_separator: !1, encode: "encodeReserved"},
        "#": {prefix: "#", separator: ",", named: !1, empty_name_separator: !1, encode: "encodeReserved"},
        ".": {prefix: ".", separator: ".", named: !1, empty_name_separator: !1, encode: "encode"},
        "/": {prefix: "/", separator: "/", named: !1, empty_name_separator: !1, encode: "encode"},
        ";": {prefix: ";", separator: ";", named: !0, empty_name_separator: !1, encode: "encode"},
        "?": {prefix: "?", separator: "&", named: !0, empty_name_separator: !0, encode: "encode"},
        "&": {
            prefix: "&",
            separator: "&", named: !0, empty_name_separator: !0, encode: "encode"
        }
    };
    g._cache = {};
    g.EXPRESSION_PATTERN = /\{([^a-zA-Z0-9%_]?)([^\}]+)(\}|$)/g;
    g.VARIABLE_PATTERN = /^([^*:]+)((\*)|:(\d+))?$/;
    g.VARIABLE_NAME_PATTERN = /[^a-zA-Z0-9%_]/;
    g.expand = function (b, f) {
        var h = n[b.operator], k = h.named ? "Named" : "Unnamed", q = b.variables, r = [], v, p, l;
        for (l = 0; p = q[l]; l++)v = f.get(p.name), v.val.length ? r.push(g["expand" + k](v, h, p.explode, p.explode && h.separator || ",", p.maxlength, p.name)) : v.type && r.push("");
        return r.length ? h.prefix + r.join(h.separator) :
            ""
    };
    g.expandNamed = function (b, g, h, k, q, r) {
        var v = "", p = g.encode;
        g = g.empty_name_separator;
        var l = !b[p].length, e = 2 === b.type ? "" : f[p](r), w, n, t;
        n = 0;
        for (t = b.val.length; n < t; n++)q ? (w = f[p](b.val[n][1].substring(0, q)), 2 === b.type && (e = f[p](b.val[n][0].substring(0, q)))) : l ? (w = f[p](b.val[n][1]), 2 === b.type ? (e = f[p](b.val[n][0]), b[p].push([e, w])) : b[p].push([void 0, w])) : (w = b[p][n][1], 2 === b.type && (e = b[p][n][0])), v && (v += k), h ? v += e + (g || w ? "=" : "") + w : (n || (v += f[p](r) + (g || w ? "=" : "")), 2 === b.type && (v += e + ","), v += w);
        return v
    };
    g.expandUnnamed =
        function (b, g, h, k, q) {
            var r = "", v = g.encode;
            g = g.empty_name_separator;
            var p = !b[v].length, n, e, l, t;
            l = 0;
            for (t = b.val.length; l < t; l++)q ? e = f[v](b.val[l][1].substring(0, q)) : p ? (e = f[v](b.val[l][1]), b[v].push([2 === b.type ? f[v](b.val[l][0]) : void 0, e])) : e = b[v][l][1], r && (r += k), 2 === b.type && (n = q ? f[v](b.val[l][0].substring(0, q)) : b[v][l][0], r += n, r = h ? r + (g || e ? "=" : "") : r + ","), r += e;
            return r
        };
    g.noConflict = function () {
        h.URITemplate === g && (h.URITemplate = b);
        return g
    };
    z.expand = function (b) {
        var f = "";
        this.parts && this.parts.length || this.parse();
        b instanceof t || (b = new t(b));
        for (var h = 0, k = this.parts.length; h < k; h++)f += "string" === typeof this.parts[h] ? this.parts[h] : g.expand(this.parts[h], b);
        return f
    };
    z.parse = function () {
        var b = this.expression, f = g.EXPRESSION_PATTERN, h = g.VARIABLE_PATTERN, k = g.VARIABLE_NAME_PATTERN, q = [], r = 0, l, p, t;
        for (f.lastIndex = 0; ;) {
            p = f.exec(b);
            if (null === p) {
                q.push(b.substring(r));
                break
            } else q.push(b.substring(r, p.index)), r = p.index + p[0].length;
            if (!n[p[1]])throw Error('Unknown Operator "' + p[1] + '" in "' + p[0] + '"');
            if (!p[3])throw Error('Unclosed Expression "' +
                p[0] + '"');
            l = p[2].split(",");
            for (var e = 0, w = l.length; e < w; e++) {
                t = l[e].match(h);
                if (null === t)throw Error('Invalid Variable "' + l[e] + '" in "' + p[0] + '"');
                if (t[1].match(k))throw Error('Invalid Variable Name "' + t[1] + '" in "' + p[0] + '"');
                l[e] = {name: t[1], explode: !!t[3], maxlength: t[4] && parseInt(t[4], 10)}
            }
            if (!l.length)throw Error('Expression Missing Variable(s) "' + p[0] + '"');
            q.push({expression: p[0], operator: p[1], variables: l})
        }
        q.length || q.push(b);
        this.parts = q;
        return this
    };
    t.prototype.get = function (b) {
        var f = this.data,
            g = {type: 0, val: [], encode: [], encodeReserved: []}, k;
        if (void 0 !== this.cache[b])return this.cache[b];
        this.cache[b] = g;
        f = "[object Function]" === String(Object.prototype.toString.call(f)) ? f(b) : "[object Function]" === String(Object.prototype.toString.call(f[b])) ? f[b](b) : f[b];
        if (void 0 !== f && null !== f)if ("[object Array]" === String(Object.prototype.toString.call(f))) {
            k = 0;
            for (b = f.length; k < b; k++)void 0 !== f[k] && null !== f[k] && g.val.push([void 0, String(f[k])]);
            g.val.length && (g.type = 3)
        } else if ("[object Object]" === String(Object.prototype.toString.call(f))) {
            for (k in f)l.call(f,
                k) && void 0 !== f[k] && null !== f[k] && g.val.push([k, String(f[k])]);
            g.val.length && (g.type = 2)
        } else g.type = 1, g.val.push([void 0, String(f)]);
        return g
    };
    f.expand = function (b, h) {
        var l = (new g(b)).expand(h);
        return new f(l)
    };
    return g
});
(function (f, h) {
    "object" === typeof exports ? module.exports = h(require("jquery", "./URI")) : "function" === typeof define && define.amd ? define(["jquery", "./URI"], h) : h(f.jQuery, f.URI)
})(this, function (f, h) {
    function g(b) {
        return b.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")
    }

    function t(b) {
        var f = b.nodeName.toLowerCase();
        return "input" === f && "image" !== b.type ? void 0 : h.domAttributes[f]
    }

    function b(b) {
        return {
            get: function (g) {
                return f(g).uri()[b]()
            }, set: function (g, h) {
                f(g).uri()[b](h);
                return h
            }
        }
    }

    function l(b, g) {
        var h, l, p;
        if (!t(b) || !g)return !1;
        h = g.match(D);
        if (!h || !h[5] && ":" !== h[2] && !n[h[2]])return !1;
        p = f(b).uri();
        if (h[5])return p.is(h[5]);
        if (":" === h[2])return l = h[1].toLowerCase() + ":", n[l] ? n[l](p, h[4]) : !1;
        l = h[1].toLowerCase();
        return z[l] ? n[h[2]](p[l](), h[4], l) : !1
    }

    var z = {}, n = {
        "=": function (b, f) {
            return b === f
        }, "^=": function (b, f) {
            return !!(b + "").match(new RegExp("^" + g(f), "i"))
        }, "$=": function (b, f) {
            return !!(b + "").match(new RegExp(g(f) + "$", "i"))
        }, "*=": function (b, f, h) {
            "directory" === h && (b += "/");
            return !!(b + "").match(new RegExp(g(f), "i"))
        },
        "equals:": function (b, f) {
            return b.equals(f)
        }, "is:": function (b, f) {
            return b.is(f)
        }
    };
    f.each("origin authority directory domain filename fragment hash host hostname href password path pathname port protocol query resource scheme search subdomain suffix tld username".split(" "), function (g, h) {
        z[h] = !0;
        f.attrHooks["uri:" + h] = b(h)
    });
    var u = function (b, g) {
        return f(b).uri().href(g).toString()
    };
    f.each(["src", "href", "action", "uri", "cite"], function (b, g) {
        f.attrHooks[g] = {set: u}
    });
    f.attrHooks.uri.get = function (b) {
        return f(b).uri()
    };
    f.fn.uri = function (b) {
        var f = this.first(), g = f.get(0), l = t(g);
        if (!l)throw Error('Element "' + g.nodeName + '" does not have either property: href, src, action, cite');
        if (void 0 !== b) {
            var n = f.data("uri");
            if (n)return n.href(b);
            b instanceof h || (b = h(b || ""))
        } else {
            if (b = f.data("uri"))return b;
            b = h(f.attr(l) || "")
        }
        b._dom_element = g;
        b._dom_attribute = l;
        b.normalize();
        f.data("uri", b);
        return b
    };
    h.prototype.build = function (b) {
        if (this._dom_element)this._string = h.build(this._parts), this._deferred_build = !1, this._dom_element.setAttribute(this._dom_attribute,
            this._string), this._dom_element[this._dom_attribute] = this._string; else if (!0 === b)this._deferred_build = !0; else if (void 0 === b || this._deferred_build)this._string = h.build(this._parts), this._deferred_build = !1;
        return this
    };
    var A, D = /^([a-zA-Z]+)\s*([\^\$*]?=|:)\s*(['"]?)(.+)\3|^\s*([a-zA-Z0-9]+)\s*$/;
    A = f.expr.createPseudo ? f.expr.createPseudo(function (b) {
        return function (f) {
            return l(f, b)
        }
    }) : function (b, f, g) {
        return l(b, g[3])
    };
    f.expr[":"].uri = A;
    return f
});
