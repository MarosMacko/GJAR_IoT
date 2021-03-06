import os, sys
import time
import argparse
import yaml
from collections import namedtuple
from yattag import Doc, indent

parser = argparse.ArgumentParser(description="A tool for consolidating YAML changelogs.")
parser.add_argument("-l", "--location", action="store", help="Only specify if changelog location differs from the script's location.")
parser.add_argument("-v", "--verbose", action="store_true")
parser.add_argument("-n", "--no-changes", action="store_true", help="Dry run, no file changes.")
args = parser.parse_args()

def verbose(msg):
    print(msg)

# not verbose => replace the def
if not args.verbose:
    def _verbose(msg):
        pass
    verbose = _verbose


date = time.strftime("%Y-%m-%d")

change = namedtuple("change", ("type", "value"))
#log = namedtuple("log", ("author", "changes"))
class log():
    __slots__ = ("author", "changes")
    def __init__(self, author, changes):
        self.author = author
        self.changes = changes
    def __repr__(self):
        return "log(author={}, changes={})".format(repr(self.author), repr(self.changes))

class Loader():
    allowed_types = {"add", "remove", "tweak", "bugfix"}
    def __init__(self, loc):
        self.counter = 0
        self.logs = {}

    def load_old(self, data):
        # self.logs = yaml.load(data)
        y = yaml.safe_load(data)
        for d in y:
            self.logs[d] = []
            for item in y[d]:
                self.load_log(item, d, False)

    def find_by_author(self, name, logdate=date):
        for item in self.logs[logdate]:
            if item.author == name:
                return item
        return None

    def load_log(self, data, logdate=date, count=True):
        author = data["author"]
        changes = []
        for entry in data["changes"]:
            for ch in [change(type=k, value=v) for k, v in entry.items()]:
                if ch.type in self.allowed_types:
                    changes.append(ch)
                else:
                    raise Exception("Invalid change type.")
        if logdate not in self.logs:
            self.logs[logdate] = []
        l = self.find_by_author(author, logdate)
        if l:
            l.changes += changes
        else:
            self.logs[logdate].append(log(author=author, changes=changes))
        if count:
            self.counter += 1

    def tranform_logs(self):
        r = {}
        for d in sorted(self.logs.keys()):
            r[d] = [{"author": item.author, "changes": [{ch.type: ch.value} for ch in item.changes]} for item in self.logs[d]]
        return r

    def save_yaml(self, path):
        data = "# Automatically generated changelog archive. Not to be modified manually.\n"
        data += yaml.safe_dump(self.tranform_logs(), default_flow_style=False)
        if not args.no_changes:
            with open(os.path.join(path, "changelog.yml"), "w") as f:
                f.write(data)
            verbose("Saving changelog.yml")
        else:
            verbose("Would save changelog.yml")

    def save(self, path):
        print("Adding {} new changelogs.".format(self.counter))
        self.save_yaml(path)
        doc, tag, text = Doc().tagtext()
        doc.asis('<!DOCTYPE html>')
        doc.asis("<!-- AUTOMATICALLY GENERATED - NOT TO BE MODIFIED MANUALLY -->")
        with tag('html'):
            with tag("head"):
                doc.stag("meta", charset="utf-8")
                doc.line("title", "GJAR IoT Changelog")
                with open(os.path.join(path, "changelog.css"), "r") as f:
                    doc.line("style", f.read())
            with tag('body'):
                doc.line("h1", "GJAR IoT Changelog")
                doc.line("i", "Last generated: {}".format(date))
                for d in sorted(self.logs.keys()):
                    with tag("div"):
                        doc.line("h2", d)
                        with tag("ul"):
                            for item in self.logs[d]:
                                with tag("li"):
                                    doc.line("h3", item.author)
                                    with tag("ul"):
                                        for ch in item.changes:
                                            doc.line("li", ch.value, klass="type-" + ch.type)

        if not args.no_changes:
            with open(os.path.join(path, "changelog.html"), "w") as f:
                f.write(indent(doc.getvalue()))
            verbose("Saving changelog.html")
        else:
            verbose("Would save changelog.html")



if args.location:
    loc = args.location
else:
    loc = os.path.dirname(os.path.realpath(__file__))

files = []
loader = Loader(loc)
print("Running in directory {}...".format(loc))

if os.path.isfile(os.path.join(loc, "changelog.yml")):
    verbose("changelog.yml file exists, loading old changelogs.")
    with open(os.path.join(loc, "changelog.yml"), "r") as f:
        loader.load_old(f.read())

for f in os.listdir(loc):
    if not f.endswith(".yml") or f in ("template.yml", "changelog.yml"):
        verbose("Skipping file {}.".format(f))
        continue
    try:
        with open(os.path.join(loc, f), "r") as lf:
            verbose("Reading file {}.".format(f))
            try:
                loader.load_log(yaml.safe_load(lf.read()))
            except Exception:
                print("Error when reading file {}. Skipping.".format(f), end="\t")
                print(sys.exc_info()[1])
                continue
    except Exception:
        print("Error when opening file {}. Skipping.".format(f))
        continue
    files.append(f)

loader.save(loc)

if not args.no_changes:
    print("Purging directory {}...".format(loc))
    for f in files:
        try:
            os.remove(os.path.join(loc, f))
            verbose("Removing file {}.".format(f))
        except:
            print("Could not remove file {}.".format(f))
