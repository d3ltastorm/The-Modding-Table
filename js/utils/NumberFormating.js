
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision = 2, small, forceShitStandart) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    forceShitStandart = forceShitStandart || options.shitStandart
    if (forceShitStandart
       && decimal.lt(new Decimal(10).pow(
           new Decimal(10).pow(
               new Decimal(4).mul(
                   new Decimal(2).pow(new Decimal(10).pow(new Decimal(4).mul(new Decimal(2).pow(10000)))))
               ).mul(3)
           )
        )) { 
        return formatShitStandart(decimal)
    }
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

}

function formatWhole(decimal, forceShitStandart) {
    decimal = new Decimal(decimal)
    forceShitStandart = forceShitStandart || options.shitStandart
    if (forceShitStandart) return formatShitStandartWhole(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}
function shitStandart(illion) {
    let a = [
        "k M B T q Q s S O N",
        " u d t q Q s S o n",
        " D V Tg qg Qg sg Sg Og Ng",
        " C De Te qe Qe se Se Oe Ne",
        " Mi Dl Tl ql Ql sl Sl Ol Nl",
        " α β γ δ ε ζ η θ ι",
        " κ λ μ ν ξ ο π ρ σ",
        " τ υ φ χ ψ ω ϱ ϸ ϟ",
        " 'α 'β 'γ 'δ 'ε 'ζ 'η 'θ 'ι",
        " а б в г д е ж з и",
        " й к л м н о п р с",
        " т у ф х ц ч ш щ ь",
        " 'а 'б 'в 'г 'д 'е 'ж 'з 'и"
    ];
    function Tier1OnTier2(ill,thr=0) {
        if (ill.gte(thr)) return `${a[4].split(" ")[ill.div(1000).floor().toNumber()]}${a[1].split(" ")[ill.mod(10).toNumber()]}${a[2].split(" ")[ill.div(10).floor().mod(10).toNumber()]}${a[3].split(" ")[ill.div(100).floor().mod(10).toNumber()]}`
        else return ""
    }
    function getTier2Bin(i) {
        return `${a[5].split(" ")[i.mod(10).toNumber()]}${a[6].split(" ")[i.div(10).floor().mod(10).toNumber()]}${a[7].split(" ")[i.div(100).floor().mod(10).toNumber()]}${a[8].split(" ")[i.div(1000).floor().toNumber()]}`
    }
    function getTier3Bin(i) {
        return `${a[9].split(" ")[i.mod(10).toNumber()]}${a[10].split(" ")[i.div(10).floor().mod(10).toNumber()]}${a[11].split(" ")[i.div(100).floor().mod(10).toNumber()]}${a[12].split(" ")[i.div(1000).floor().toNumber()]}`
    }
    function Tier3(ill) {
        if (ill.eq(0)) return "";
        let st = [];
        let e = ill.log(2).floor();
        for (let i = 0; i <= 10; i++) {
            let j = new Decimal(i).add(e.gte(10)?e.sub(10):0);
            if (ill.div(new Decimal(2).pow(j)).floor().mod(2).eq(1)) {
                st.push(getTier3Bin(j.add(1)));
            }
        };
        return st.join("=")
    }
    function Tier3Sep(ill) {
        if (ill.eq(0)) return "";
        let st = [];
        let e = ill.log10().div(4).floor();
        let tier3ill = e;
        if (e.eq(0)) {
            return getTier2Bin(ill)
        }
        if (e.gte(1024)) {
            return Tier3(tier3ill)
        };
        for (let i = 0; i < (e.gte(3) ? 3 : e.add(1).toNumber()); i++) {
            if (i === 0) {
                if (!g(tier3ill,ill).eq(0)) st.push(`${g(tier3ill,ill).gte(2)?getTier2Bin(g(tier3ill,ill)):""}${Tier3(tier3ill)}`)
            } else {
                if (!g(tier3ill,ill).eq(0)) st.push(`${getTier2Bin(g(tier3ill,ill))}${Tier3(tier3ill)}`)
            }
            tier3ill = tier3ill.sub(1)
        };
        return st.join("-")
    }
    
    function Tier2(ill) {
        if (ill.eq(0)) return "";
        let st = [];
        let e = ill.log(2).floor();
        if (e.gte(1_0000)) {
            return Tier3Sep(e)
        }
        for (let i = 0; i <= 10; i++) {
            let j = new Decimal(i).add(e.gte(10)?e.sub(10):0);
            if (ill.div(new Decimal(2).pow(j)).floor().mod(2).eq(1)) {
                st.push(Tier3Sep(j.add(1)));
            }
        };
        return st.join("-")
    }
    function g(number,i=illion) {
        return i.div(new Decimal(10000).pow(number)).floor().mod(10000)
    }
    if (illion.lt(10000)) {
        if (illion.lt(10)) {
            return a[0].split(" ")[illion.toNumber()]
        } else {
            return `${a[4].split(" ")[illion.div(1000).floor().toNumber()]}${a[1].split(" ")[illion.mod(10).toNumber()]}${a[2].split(" ")[illion.div(10).floor().mod(10).toNumber()]}${a[3].split(" ")[illion.div(100).floor().mod(10).toNumber()]}`
        }
    } else {
        let e = illion.log10().div(4).floor();
        let tier2ill = e;
        let s = "";
        if (e.gte(1024)) {
            return Tier3Sep(e)
        };
        for (let i = 0; i < (e.gte(3) ? 3 : e.add(1).toNumber()); i++) {
            if (i === 0) {
                if (!g(tier2ill).eq(0)) s+=`${Tier1OnTier2(g(tier2ill), 2)}${Tier2(tier2ill)}`
            } else {
                if (!g(tier2ill).eq(0)) s+=`${Tier1OnTier2(g(tier2ill))}${Tier2(tier2ill)}`
            }
            tier2ill = tier2ill.sub(1)
        };
        return s
    }
};
function formatShitStandart(number) {
    let s = "";
    if (number.lt(0)) {
        s = `-${formatShitStandart(number.neg())}`
    } else if (number.lt(1000)) {
        s = number.toStringWithDecimalPlaces(2)
    } else if (number.lt(new Decimal(10).pow(3_0000_0003))) {
        s = `${number.div(new Decimal(1000).pow(number.log(1000).floor())).toStringWithDecimalPlaces(2)}${shitStandart(number.log(1000).sub(1).floor())}`
    } else {
        s = shitStandart(number.log(1000).sub(1).floor())
    };
    return s
};
function formatShitStandartWhole(number) {
    let s = "";
    if (number.lt(0)) {
        s = `-${formatShitStandartWhole(number.neg().floor())}`
    } else if (number.lt(1000)) {
        s = number.floor()
    } else if (number.lt(new Decimal(10).pow(3_0000_0003))) {
        s = `${number.div(new Decimal(1000).pow(number.log(1000).floor())).toStringWithDecimalPlaces(2)}${shitStandart(number.log(1000).sub(1).floor())}`
    } else {
        s = shitStandart(number.log(1000).sub(1).floor())
    };
    return s
};

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}
