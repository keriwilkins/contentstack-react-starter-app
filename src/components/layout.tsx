import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import DevTools from "./devtools";
import { getHeaderRes, getFooterRes, getAllEntries } from "../helper";
import { onEntryChange } from "../sdk/entry";
import { EntryProps } from "../typescript/components";
import { FooterRes, HeaderRes, NavigationMenu } from "../typescript/response";
import { Link } from "../typescript/pages";

export default function Layout({ entry }: { entry: EntryProps }) {
  const history = useNavigate();
  const [getLayout, setLayout] = useState({
    header: {} as HeaderRes,
    navHeaderList: [] as NavigationMenu[],
  });

  const mergeObjs = (...objs: any) => Object.assign({}, ...objs);
  const jsonObj = mergeObjs(
    { header: getLayout.header },
    entry
  );

  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      const header = await getHeaderRes();
      // const footer = await getFooterRes();
      const allEntry = await getAllEntries();
      !header || (!header && setError(true));
      const navHeaderList = header.navigation_menu;
      // const navFooterList = footer.navigation.link;
      if (allEntry.length !== header.navigation_menu.length) {
        allEntry.forEach((entry) => {
          const hFound = header.navigation_menu.find(
            (navLink) => navLink.label === entry.title
          );
          if (!hFound) {
            navHeaderList.push({
              label: entry.title,
              page_reference: [
                { title: entry.title, url: entry.url, uid: entry.uid },
              ],
            });
          }
          // const fFound = footer.navigation.link.find(
          //   (link) => link.title === entry.title
          // );
          // if (!fFound) {
          //   navFooterList.push({
          //     title: entry.title,
          //     href: entry.url
          //   });
          // }
        });
      }

      setLayout({
        header: header,
        navHeaderList,
      });
    } catch (error) {
      setError(true);
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(fetchData);
  }, []);

  useEffect(() => {
    console.error("error...", error);
    error && history("/error");
  }, [error]);

  // Ensure the component returns valid JSX
  return (
    <div className="layout">
      <Header header={getLayout.header} navMenu={getLayout.navHeaderList} />
      <DevTools response={jsonObj} />
      <Outlet />
      <h1>Components?</h1>
      {/* <Footer footer={getLayout.footer} navMenu={getLayout.navFooterList} /> */}
    </div>
  );
}
